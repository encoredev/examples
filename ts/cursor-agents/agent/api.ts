import { api, APIError, type Header } from "encore.dev/api";
import { appMeta } from "encore.dev";
import { db, json } from "./db";
import { createAgent, reapStale, startTurn, type TurnEventKind } from "./runtime";

export type TurnStatus = "running" | "finished" | "error" | "cancelled";

export interface Thread {
  id: string;
  title: string;
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
  status: TurnStatus | null;
  created_at: Date;
  updated_at: Date;
}

const toThread = (r: ThreadRow): Thread => ({
  id: r.id,
  title: r.title,
  status: r.status,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

const THREAD_SELECT = `
  SELECT t.*, (SELECT status FROM turns WHERE thread_id = t.id ORDER BY created_at DESC LIMIT 1) AS status
  FROM threads t`;

// The sender's own Cursor API key, sent by the UI with every message. It is
// used for that run and never stored.
interface WithKey {
  key?: Header<"X-Cursor-Key">;
}

// Starts a new conversation: a new Cursor agent, and its first message.
export const create = api(
  { expose: true, method: "POST", path: "/threads" },
  async ({ prompt, key }: WithKey & { prompt: string }): Promise<{ threadId: string; turnId: string }> => {
    const threadId = await createAgent(key);
    const title = prompt.length > 64 ? `${prompt.slice(0, 61).trimEnd()}…` : prompt;
    await db.exec`INSERT INTO threads (id, title) VALUES (${threadId}, ${title})`;
    return { threadId, turnId: await startTurn(threadId, prompt, key) };
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
  async ({ id, prompt, key }: WithKey & { id: string; prompt: string }): Promise<{ turnId: string }> => {
    const exists = await db.queryRow`SELECT 1 AS ok FROM threads WHERE id = ${id}`;
    if (!exists) throw APIError.notFound("thread not found");
    return { turnId: await startTurn(id, prompt, key) };
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

export interface ChatStats {
  threads: number;
  turns: number;
  toolCalls: number;
  totalTokens: number;
  running: number;
}

// App-wide counters for the sidebar.
export const stats = api(
  { expose: true, method: "GET", path: "/stats" },
  async (): Promise<ChatStats> => {
    const r = await db.queryRow<ChatStats>`
      SELECT
        (SELECT count(*)::int FROM threads) AS threads,
        (SELECT count(*)::int FROM turns) AS turns,
        (SELECT count(*)::int FROM turn_events WHERE kind = 'tool' AND data->>'status' = 'completed') AS "toolCalls",
        (SELECT coalesce(sum((usage->>'totalTokens')::bigint), 0)::bigint FROM turns) AS "totalTokens",
        (SELECT count(*)::int FROM turns WHERE status = 'running') AS running`;
    return { ...r!, totalTokens: Number(r!.totalTokens) };
  },
);

// Tells the UI where the app runs: its ID for dashboard links, and its cloud
// ("local", "encore" for Encore Cloud hosting, "aws" or "gcp").
export const setup = api(
  { expose: true, method: "GET", path: "/setup" },
  async (): Promise<{ appId: string; cloud: string }> => ({
    appId: appMeta().appId,
    cloud: appMeta().environment.cloud,
  }),
);
