import { mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { Agent, type SDKAgent, type SDKCustomTool } from "@cursor/sdk";
import { APIError } from "encore.dev/api";
import { secret } from "encore.dev/config";
import log from "encore.dev/log";
import { db } from "./db";
import { postgresAgentStore } from "./store";
import { deskTools } from "./tools";
import { findRecording, replayTurn } from "./replay";
import { RECORDINGS } from "./recordings";

// Where the Cursor agent loop runs: right here, in this service's process.
// Inference goes to Cursor's hosted models; everything else (tool calls,
// conversation state, the data the tools touch) stays in your cloud account.

const cursorApiKey = secret("CursorApiKey");

// The desk runs in one of three modes, all decided by the CursorApiKey secret:
//   setup:  no key yet. The UI shows how to add one instead of failing.
//   replay: the key is the literal string "replay". The desk replays recorded
//           runs (see replay.ts) instead of calling the model, so it can be
//           shown without spending tokens. With no recordings there is nothing
//           to replay, so it counts as setup.
//   live:   a real key. The agent runs for real.
export type Mode = "setup" | "replay" | "live";
export const mode = (): Mode => {
  const key = cursorApiKey().trim();
  if (key === "replay") return RECORDINGS.length > 0 ? "replay" : "setup";
  return key === "" ? "setup" : "live";
};

const NO_KEY = "No Cursor API key yet. Add one as the CursorApiKey secret, then send this again.";

const MODEL = { id: "composer-2.5" };

// The agent never touches the filesystem (it only gets the MCP tool family),
// but the SDK still wants a working directory to scope its sessions.
const WORKSPACE = join(tmpdir(), "oncall-desk");
mkdirSync(WORKSPACE, { recursive: true });

// Sent with the first turn of every thread. Kept in code rather than in the
// replaceable system prompt, which is gated per account.
const BRIEF = `You are the on-call engineer for an online store. You work through the
tools you have been given and nothing else.

How you work:
- Start from the incident itself, then look for a cause: recent deploys to the
  affected service, and its metrics before and after each suspect deploy.
- Say what the evidence shows, with numbers. If it is inconclusive, say so.
- When you have looked at an open incident, set it to investigating and post a
  short timeline update with your finding and a recommended next step.
- Never resolve incidents and never suggest you ran anything you did not run.

Reply in short paragraphs or a few bullets. No headings.`;

const options = (tools: Record<string, SDKCustomTool>) => ({
  apiKey: cursorApiKey(),
  model: MODEL,
  tools: ["mcp"],
  local: { cwd: WORKSPACE, store: postgresAgentStore, customTools: tools },
});

// A turn's run lives in the process that started it, which bumps the turn's
// heartbeat while it runs. If that process dies (a deploy, a crash), the
// heartbeat stops; a couple of minutes later the turn is marked interrupted so
// the thread can take new messages. A run that is only slow keeps beating.
const HEARTBEAT_MS = 15_000;
const STALE_MINUTES = 2;
export const reapStale = () =>
  db.rawExec(
    `WITH reaped AS (
       UPDATE turns t SET status = 'error', error = $2
       WHERE t.status = 'running'
         AND t.heartbeat_at < now() - make_interval(mins => $1::int)
       RETURNING t.id, t.thread_id
     )
     INSERT INTO turn_events (thread_id, turn_id, kind, data)
     SELECT thread_id, id, 'done', jsonb_build_object('status', 'error', 'error', $2::text) FROM reaped`,
    STALE_MINUTES,
    "Interrupted: the instance running this turn went away.",
  );
void reapStale().catch((err) => log.error(err, "reaping stale turns failed"));

// Live SDK handles, keyed by thread (= Cursor agent) id. Any instance can
// rebuild one from Postgres with Agent.resume, so this is only a cache.
const live = new Map<string, SDKAgent>();

export type TurnEventKind = "prompt" | "text" | "thinking" | "tool" | "done";

export async function record(threadId: string, turnId: string, kind: TurnEventKind, data: unknown) {
  await db.exec`
    INSERT INTO turn_events (thread_id, turn_id, kind, data)
    VALUES (${threadId}, ${turnId}, ${kind}, ${JSON.stringify(data)}::text::jsonb)`;
}

// Wraps every desk tool so each call lands in the thread's event stream with
// a clean name, its arguments and its result. The UI renders these, and the
// sidebar's block field grows a stack for each one. `before` runs first so any
// buffered text is written ahead of the tool event.
function instrument(
  threadId: string,
  turnId: string,
  before: () => Promise<void>,
): Record<string, SDKCustomTool> {
  return Object.fromEntries(
    Object.entries(deskTools).map(([name, tool]) => [
      name,
      {
        ...tool,
        async execute(args, ctx) {
          await before();
          const callId = ctx.toolCallId ?? randomUUID();
          const started = Date.now();
          await record(threadId, turnId, "tool", { callId, name, status: "running", args });
          try {
            const result = await tool.execute(args, ctx);
            await record(threadId, turnId, "tool", {
              callId,
              name,
              status: "completed",
              args,
              result,
              ms: Date.now() - started,
            });
            return result;
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            await record(threadId, turnId, "tool", { callId, name, status: "error", args, error: message });
            throw err;
          }
        },
      } satisfies SDKCustomTool,
    ]),
  );
}

// Creates a new Cursor agent and returns its id, which doubles as the thread id.
export async function createAgent(): Promise<string> {
  const m = mode();
  if (m === "setup") throw APIError.failedPrecondition(NO_KEY);
  if (m === "replay") return `demo-${randomUUID()}`;
  const agent = await Agent.create(options(deskTools));
  live.set(agent.agentId, agent);
  return agent.agentId;
}

async function getAgent(threadId: string): Promise<SDKAgent> {
  const cached = live.get(threadId);
  if (cached) return cached;
  const agent = await Agent.resume(threadId, options(deskTools));
  live.set(threadId, agent);
  return agent;
}

// Checks that the desk can answer this prompt, before anything is written:
// it needs a key, and in replay mode a recording of the prompt.
export function checkPrompt(prompt: string) {
  const m = mode();
  if (m === "setup") throw APIError.failedPrecondition(NO_KEY);
  if (m === "replay" && !findRecording(prompt)) {
    throw APIError.failedPrecondition(
      "This desk replays recorded runs, so it only answers the suggested prompts. Add your Cursor API key to ask it anything.",
    );
  }
}

const BUSY = "the agent is still working on the last message";

// Starts a turn and returns its id straight away. The run itself continues in
// the background, writing events that the stream endpoint tails.
export async function startTurn(threadId: string, prompt: string): Promise<string> {
  checkPrompt(prompt);
  const recording = mode() === "replay" ? findRecording(prompt) : null;

  await reapStale();
  const busy = await db.queryRow`
    SELECT 1 AS busy FROM turns WHERE thread_id = ${threadId} AND status = 'running'`;
  if (busy) throw APIError.failedPrecondition(BUSY);

  const prior = await db.queryRow<{ n: number }>`
    SELECT count(*)::int AS n FROM turns WHERE thread_id = ${threadId}`;
  const message = prior!.n === 0 ? `${BRIEF}\n\n---\n\n${prompt}` : prompt;

  // The check above gives the usual answer; the unique index on running turns
  // settles two messages that pass it at the same moment.
  const turnId = randomUUID();
  try {
    await db.exec`
      INSERT INTO turns (id, thread_id, prompt, model) VALUES (${turnId}, ${threadId}, ${prompt}, ${MODEL.id})`;
  } catch (err) {
    if (String(err).includes("turns_one_running")) throw APIError.failedPrecondition(BUSY);
    throw err;
  }
  await db.exec`UPDATE threads SET updated_at = now() WHERE id = ${threadId}`;
  await record(threadId, turnId, "prompt", { text: prompt });

  const beat = setInterval(() => {
    db.exec`UPDATE turns SET heartbeat_at = now() WHERE id = ${turnId}`.catch(() => {});
  }, HEARTBEAT_MS);
  const run = recording ? replayTurn(threadId, turnId, recording) : runTurn(threadId, turnId, message);
  void run
    .catch((err) => log.error(err, "turn crashed", { threadId, turnId }))
    .finally(() => clearInterval(beat));
  return turnId;
}

async function runTurn(threadId: string, turnId: string, message: string) {
  // Text and thinking arrive token by token. Writing a row per token would be
  // wasteful, so deltas are buffered and flushed a few times a second, and
  // always before a tool event so the transcript stays in order.
  const pending = { text: "", thinking: "" };
  let chain = Promise.resolve();
  const flush = () => {
    const { text, thinking } = pending;
    pending.text = pending.thinking = "";
    chain = chain.then(async () => {
      if (thinking) await record(threadId, turnId, "thinking", { text: thinking });
      if (text) await record(threadId, turnId, "text", { text });
    });
    return chain;
  };
  const timer = setInterval(flush, 150);

  try {
    const agent = await getAgent(threadId);
    const run = await agent.send(message, {
      local: { customTools: instrument(threadId, turnId, flush) },
      onDelta: ({ update }) => {
        if (update.type === "text-delta") pending.text += update.text;
        else if (update.type === "thinking-delta") pending.thinking += update.text;
      },
    });
    const result = await run.wait();
    clearInterval(timer);
    await flush();

    await db.exec`
      UPDATE turns SET status = ${result.status}, result = ${result.result ?? null},
        error = ${result.error?.message ?? null}, usage = ${JSON.stringify(result.usage ?? null)}::text::jsonb,
        duration_ms = ${result.durationMs ?? null}
      WHERE id = ${turnId}`;
    await record(threadId, turnId, "done", {
      status: result.status,
      error: result.error?.message,
      usage: result.usage,
      durationMs: result.durationMs,
    });
  } catch (err) {
    clearInterval(timer);
    await flush();
    const message = err instanceof Error ? err.message : String(err);
    await db.exec`UPDATE turns SET status = 'error', error = ${message} WHERE id = ${turnId}`;
    await record(threadId, turnId, "done", { status: "error", error: message });
    // A broken handle (bad key, network) shouldn't poison later turns.
    live.delete(threadId);
  }
}
