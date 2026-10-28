import { mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { Agent, type SDKAgent, type SDKCustomTool } from "@cursor/sdk";
import { APIError } from "encore.dev/api";
import log from "encore.dev/log";
import { db } from "./db";
import { postgresAgentStore } from "./store";
import { agentTools } from "./tools";

// Where the Cursor agent loop runs: right here, in this service's process.
// Inference goes to Cursor's hosted models; everything else (tool calls,
// conversation state, the data the tools touch) stays in your cloud account.
//
// There is no server-side key. Each message carries the sender's own Cursor API
// key (the UI keeps it in the browser), and it is used for that run only and
// never stored. Someone who finds a deployed app's URL can't spend your key.

const NO_KEY = "Add your Cursor API key to send messages.";

const MODEL = { id: "composer-2.5" };

// The agent never touches the filesystem (it only gets the MCP tool family),
// but the SDK still wants a working directory to scope its sessions.
const WORKSPACE = join(tmpdir(), "notes-agent");
mkdirSync(WORKSPACE, { recursive: true });

// Sent with the first turn of every thread. Kept in code rather than in the
// replaceable system prompt, which is gated per account.
const BRIEF = `You are a notes assistant. You keep the user's notes with the tools you
have been given and nothing else.

How you work:
- When the user tells you something worth keeping, save it as a note with a
  short, specific title. Update an existing note rather than adding a near copy.
- When they ask about something, search the notes first and answer from them.
  Say so if nothing matches; never make up a note.

Reply in short paragraphs or a few bullets. No headings.`;

const options = (apiKey: string, tools: Record<string, SDKCustomTool>) => ({
  apiKey,
  model: MODEL,
  tools: ["mcp"],
  local: { cwd: WORKSPACE, store: postgresAgentStore, customTools: tools },
});

// Cursor's errors arrive as raw JSON from its API. The common key problems get
// one plain sentence; anything else keeps the detail Cursor gave, if any.
const keyError = (err: unknown) => {
  const raw =
    typeof err === "object" && err !== null && "message" in err ? String(err.message) : String(err);
  if (raw.includes("cli:session")) {
    return "This Cursor API key can't run agents in your own service: it's missing the cli:session scope. Create a user API key at cursor.com/dashboard/api and use that instead.";
  }
  if (/invalid user api key/i.test(raw)) return "Cursor didn't accept this API key. Check it, or create a new one at cursor.com/dashboard/api.";
  const detail = raw.match(/"detail":"([^"]+)"/)?.[1];
  return detail ? `Cursor refused the request: ${detail}` : raw;
};

const requireKey = (apiKey: string | undefined) => {
  const key = apiKey?.trim();
  if (!key) throw APIError.failedPrecondition(NO_KEY);
  return key;
};

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

// Live SDK handles, keyed by thread (= Cursor agent) id, with the key each was
// opened with. Any instance can rebuild one from Postgres with Agent.resume,
// so this is only a cache; a message with a different key reopens it.
const live = new Map<string, { key: string; agent: SDKAgent }>();

export type TurnEventKind = "prompt" | "text" | "thinking" | "tool" | "done";

export async function record(threadId: string, turnId: string, kind: TurnEventKind, data: unknown) {
  await db.exec`
    INSERT INTO turn_events (thread_id, turn_id, kind, data)
    VALUES (${threadId}, ${turnId}, ${kind}, ${JSON.stringify(data)}::text::jsonb)`;
}

// Wraps every agent tool so each call lands in the thread's event stream with
// a clean name, its arguments and its result. The UI renders these, and the
// sidebar's block field grows a stack for each one. `before` runs first so any
// buffered text is written ahead of the tool event.
function instrument(
  threadId: string,
  turnId: string,
  before: () => Promise<void>,
): Record<string, SDKCustomTool> {
  return Object.fromEntries(
    Object.entries(agentTools).map(([name, tool]) => [
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
export async function createAgent(apiKey: string | undefined): Promise<string> {
  const key = requireKey(apiKey);
  let agent: SDKAgent;
  try {
    agent = await Agent.create(options(key, agentTools));
  } catch (err) {
    // Almost always the key: wrong, revoked, or missing a scope.
    throw APIError.permissionDenied(keyError(err));
  }
  live.set(agent.agentId, { key, agent });
  return agent.agentId;
}

async function getAgent(threadId: string, key: string): Promise<SDKAgent> {
  const cached = live.get(threadId);
  if (cached?.key === key) return cached.agent;
  const agent = await Agent.resume(threadId, options(key, agentTools));
  live.set(threadId, { key, agent });
  return agent;
}

const BUSY = "the agent is still working on the last message";

// Starts a turn and returns its id straight away. The run itself continues in
// the background, writing events that the stream endpoint tails.
export async function startTurn(threadId: string, prompt: string, apiKey: string | undefined): Promise<string> {
  const key = requireKey(apiKey);

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
  void runTurn(threadId, turnId, message, key)
    .catch((err) => log.error(err, "turn crashed", { threadId, turnId }))
    .finally(() => clearInterval(beat));
  return turnId;
}

async function runTurn(threadId: string, turnId: string, message: string, key: string) {
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
    const agent = await getAgent(threadId, key);
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
        error = ${result.error ? keyError(result.error) : null}, usage = ${JSON.stringify(result.usage ?? null)}::text::jsonb,
        duration_ms = ${result.durationMs ?? null}
      WHERE id = ${turnId}`;
    await record(threadId, turnId, "done", {
      status: result.status,
      error: result.error ? keyError(result.error) : undefined,
      usage: result.usage,
      durationMs: result.durationMs,
    });
  } catch (err) {
    clearInterval(timer);
    await flush();
    const message = keyError(err);
    await db.exec`UPDATE turns SET status = 'error', error = ${message} WHERE id = ${turnId}`;
    await record(threadId, turnId, "done", { status: "error", error: message });
    // A broken handle (bad key, network) shouldn't poison later turns.
    live.delete(threadId);
  }
}
