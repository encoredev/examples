import { api, APIError } from "encore.dev/api";
import { db, json } from "./db";
import { createAgent, mode, reapStale, startTurn, type Mode, type TurnEventKind } from "./runtime";
import { recordedPrompts, type Recording } from "./replay";

export type Trigger = "manual" | "incident" | "schedule";
export type TurnStatus = "running" | "finished" | "error" | "cancelled";

export interface Thread {
  id: string;
  title: string;
  trigger: Trigger;
  incidentId: number | null;
  status: TurnStatus | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Usage {
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
  totalTokens: number;
}

export interface Turn {
  id: string;
  prompt: string;
  status: TurnStatus;
  result: string | null;
  error: string | null;
  model: string | null;
  usage: Usage | null;
  durationMs: number | null;
  createdAt: Date;
}

interface ThreadRow {
  id: string;
  title: string;
  trigger: Trigger;
  incident_id: number | null;
  status: TurnStatus | null;
  created_at: Date;
  updated_at: Date;
}

const toThread = (r: ThreadRow): Thread => ({
  id: r.id,
  title: r.title,
  trigger: r.trigger,
  incidentId: r.incident_id === null ? null : Number(r.incident_id),
  status: r.status,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

const THREAD_SELECT = `
  SELECT t.*, (SELECT status FROM turns WHERE thread_id = t.id ORDER BY created_at DESC LIMIT 1) AS status
  FROM threads t`;

// Opens a new thread (a new Cursor agent) and sends it its first message.
export async function openThread(p: {
  title: string;
  prompt: string;
  trigger: Trigger;
  incidentId?: number;
}): Promise<{ threadId: string; turnId: string }> {
  const threadId = await createAgent();
  await db.exec`
    INSERT INTO threads (id, title, trigger, incident_id)
    VALUES (${threadId}, ${p.title}, ${p.trigger}, ${p.incidentId ?? null})`;
  const turnId = await startTurn(threadId, p.prompt);
  return { threadId, turnId };
}

// Starts a new conversation with the on-call agent.
export const create = api(
  { expose: true, method: "POST", path: "/threads" },
  async ({ prompt }: { prompt: string }): Promise<{ threadId: string; turnId: string }> => {
    const title = prompt.length > 64 ? `${prompt.slice(0, 61).trimEnd()}…` : prompt;
    return openThread({ title, prompt, trigger: "manual" });
  },
);

// Lists threads, most recently active first.
export const list = api(
  { expose: true, method: "GET", path: "/threads" },
  async (): Promise<{ threads: Thread[] }> => {
    await reapStale();
    const rows = await db.rawQueryAll<ThreadRow>(`${THREAD_SELECT} ORDER BY t.updated_at DESC LIMIT 50`);
    return { threads: rows.map(toThread) };
  },
);

// Returns a thread and its turns.
export const get = api(
  { expose: true, method: "GET", path: "/threads/:id" },
  async ({ id }: { id: string }): Promise<{ thread: Thread; turns: Turn[] }> => {
    const row = await db.rawQueryRow<ThreadRow>(`${THREAD_SELECT} WHERE t.id = $1`, id);
    if (!row) throw APIError.notFound("thread not found");
    const turns = await db.rawQueryAll<{
      id: string;
      prompt: string;
      status: TurnStatus;
      result: string | null;
      error: string | null;
      model: string | null;
      usage: Usage | null;
      duration_ms: number | null;
      created_at: Date;
    }>(`SELECT * FROM turns WHERE thread_id = $1 ORDER BY created_at`, id);
    return {
      thread: toThread(row),
      turns: turns.map((t) => ({
        id: t.id,
        prompt: t.prompt,
        status: t.status,
        result: t.result,
        error: t.error,
        model: t.model,
        usage: t.usage === null ? null : json(t.usage),
        durationMs: t.duration_ms,
        createdAt: t.created_at,
      })),
    };
  },
);

// Sends a follow-up message to an existing thread.
export const send = api(
  { expose: true, method: "POST", path: "/threads/:id/messages" },
  async ({ id, prompt }: { id: string; prompt: string }): Promise<{ turnId: string }> => {
    const exists = await db.queryRow`SELECT 1 AS ok FROM threads WHERE id = ${id}`;
    if (!exists) throw APIError.notFound("thread not found");
    return { turnId: await startTurn(id, prompt) };
  },
);

export interface TurnEvent {
  id: number;
  turnId: string;
  kind: TurnEventKind;
  data: any;
  at: Date;
}

interface StreamHandshake {
  id: string;
  // Resume after this event id; 0 replays the whole thread.
  after?: number;
}

// Streams a thread's events: everything after `after`, then new ones live.
//
// It tails Postgres rather than an in-memory emitter, so it works no matter
// which instance is running the turn. Encore turns this into a WebSocket and
// the generated client into an async iterator.
export const stream = api.streamOut<StreamHandshake, TurnEvent>(
  { expose: true, path: "/threads/:id/stream" },
  async ({ id, after }, out) => {
    let cursor = after ?? 0;
    let open = true;
    while (open) {
      const rows = await db.rawQueryAll<{
        id: number;
        turn_id: string;
        kind: TurnEventKind;
        data: any;
        at: Date;
      }>(`SELECT * FROM turn_events WHERE thread_id = $1 AND id > $2 ORDER BY id LIMIT 500`, id, cursor);
      for (const r of rows) {
        cursor = Number(r.id);
        try {
          await out.send({ id: cursor, turnId: r.turn_id, kind: r.kind, data: json(r.data), at: r.at });
        } catch {
          open = false; // client went away
          break;
        }
      }
      if (open && rows.length < 500) await new Promise((r) => setTimeout(r, 200));
    }
  },
);

export interface DeskStats {
  threads: number;
  turns: number;
  toolCalls: number;
  totalTokens: number;
  running: number;
}

// Desk-wide counters for the sidebar.
export const stats = api(
  { expose: true, method: "GET", path: "/stats" },
  async (): Promise<DeskStats> => {
    const r = await db.queryRow<DeskStats>`
      SELECT
        (SELECT count(*)::int FROM threads) AS threads,
        (SELECT count(*)::int FROM turns) AS turns,
        (SELECT count(*)::int FROM turn_events WHERE kind = 'tool' AND data->>'status' = 'completed') AS "toolCalls",
        (SELECT coalesce(sum((usage->>'totalTokens')::bigint), 0)::bigint FROM turns) AS "totalTokens",
        (SELECT count(*)::int FROM turns WHERE status = 'running') AS running`;
    return { ...r!, totalTokens: Number(r!.totalTokens) };
  },
);

// Tells the UI which mode the desk is in, and in replay mode which prompts
// have recordings.
export const setup = api(
  { expose: true, method: "GET", path: "/setup" },
  async (): Promise<{ mode: Mode; prompts: string[] }> => ({
    mode: mode(),
    prompts: mode() === "replay" ? recordedPrompts() : [],
  }),
);

// Exports a thread as recordings, one per turn, for replay mode. Offsets are
// measured from each turn's prompt.
export const recording = api(
  { expose: true, method: "GET", path: "/threads/:id/recording" },
  async ({ id }: { id: string }): Promise<{ recordings: Recording[] }> => {
    const rows = await db.rawQueryAll<{ turn_id: string; kind: TurnEventKind; data: any; at: Date }>(
      `SELECT turn_id, kind, data, at FROM turn_events WHERE thread_id = $1 ORDER BY id`,
      id,
    );
    const turns = new Map<string, Recording & { t0: number }>();
    for (const row of rows) {
      const r = { ...row, data: json(row.data) };
      const at = new Date(r.at).getTime();
      if (r.kind === "prompt") {
        turns.set(r.turn_id, { prompt: r.data.text, events: [], t0: at });
        continue;
      }
      const turn = turns.get(r.turn_id);
      if (turn) turn.events.push({ kind: r.kind, data: r.data, ms: at - turn.t0 });
    }
    return { recordings: [...turns.values()].map(({ prompt, events }) => ({ prompt, events })) };
  },
);
