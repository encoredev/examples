import {
  paginateAgentDocuments,
  paginateCheckpointBlobIds,
  paginateRunDocuments,
  type LocalAgentDocument,
  type LocalAgentRunDocument,
  type LocalAgentRunEventDocument,
  type LocalAgentStore,
} from "@cursor/sdk";
import { db, json } from "./db";

// A Cursor SDK LocalAgentStore backed by the service's Postgres database.
//
// By default a local Cursor agent keeps its conversation in SQLite on the
// machine it runs on, which is gone the next time a container is replaced.
// Pointing the SDK at Postgres instead means any instance of this service can
// resume any agent, and the history survives deploys. Encore provisions the
// database (RDS on AWS, Cloud SQL on GCP), so there is nothing else to run.
//
// Catalog lists load the matching rows and reuse the SDK's own pagination
// helpers, so cursor semantics match the built-in stores exactly. That is fine
// at this scale; push the ordering into SQL if you expect thousands of agents.

type Row<T> = { doc: T | string };

const offsetOf = (seq: number) => String(seq).padStart(10, "0");

interface EventRow {
  run_id: string;
  seq: number;
  event_type: string;
  payload: unknown;
  payload_ref: string | null;
  idempotency_key: string | null;
  created_at: string | number;
}

const toEvent = (r: EventRow): LocalAgentRunEventDocument => ({
  runId: r.run_id,
  seq: r.seq,
  offset: offsetOf(r.seq),
  eventType: r.event_type,
  payload: r.payload === null ? null : json(r.payload),
  payloadRef: r.payload_ref,
  idempotencyKey: r.idempotency_key,
  createdAt: Number(r.created_at),
});

const any = (xs?: readonly string[]) => (xs && xs.length > 0 ? [...xs] : null);

export const postgresAgentStore: LocalAgentStore = {
  agents: {
    async get({ agentId }) {
      const row = await db.queryRow<Row<LocalAgentDocument>>`
        SELECT doc FROM sdk_agents WHERE agent_id = ${agentId}`;
      return row ? json(row.doc) : null;
    },
    async create({ agent }) {
      await db.exec`
        INSERT INTO sdk_agents (agent_id, cwd, doc, updated_at)
        VALUES (${agent.agentId}, ${agent.cwd}, ${JSON.stringify(agent)}::text::jsonb, ${agent.updatedAt})`;
      return agent;
    },
    async update({ agent }) {
      await db.exec`
        INSERT INTO sdk_agents (agent_id, cwd, doc, updated_at)
        VALUES (${agent.agentId}, ${agent.cwd}, ${JSON.stringify(agent)}::text::jsonb, ${agent.updatedAt})
        ON CONFLICT (agent_id) DO UPDATE
          SET cwd = EXCLUDED.cwd, doc = EXCLUDED.doc, updated_at = EXCLUDED.updated_at`;
      return agent;
    },
    async delete({ filter }) {
      await db.rawExec(
        `DELETE FROM sdk_agents
         WHERE ($1::text[] IS NULL OR agent_id = ANY($1))
           AND ($2::text IS NULL OR cwd = $2)`,
        any(filter.agentIds),
        filter.cwd ?? null,
      );
    },
    async list(input) {
      const filter = input?.filter;
      const rows = await db.rawQueryAll<Row<LocalAgentDocument>>(
        `SELECT doc FROM sdk_agents WHERE ($1::text IS NULL OR cwd = $1)`,
        filter?.cwd ?? null,
      );
      return paginateAgentDocuments(
        rows.map((r) => json(r.doc)),
        filter,
      );
    },
  },

  checkpoints: {
    async get({ agentId, blobId }) {
      const row = await db.queryRow<{ data: Buffer }>`
        SELECT data FROM sdk_checkpoints WHERE agent_id = ${agentId} AND blob_id = ${blobId}`;
      return row ? new Uint8Array(row.data) : null;
    },
    async create({ agentId, blobId, data }) {
      // Content-addressed: the same blob id always holds the same bytes.
      await db.exec`
        INSERT INTO sdk_checkpoints (agent_id, blob_id, data)
        VALUES (${agentId}, ${blobId}, ${Buffer.from(data)})
        ON CONFLICT DO NOTHING`;
    },
    async update({ agentId, blobId, data }) {
      await db.exec`
        INSERT INTO sdk_checkpoints (agent_id, blob_id, data)
        VALUES (${agentId}, ${blobId}, ${Buffer.from(data)})
        ON CONFLICT (agent_id, blob_id) DO UPDATE SET data = EXCLUDED.data`;
    },
    async delete({ filter }) {
      await db.rawExec(
        `DELETE FROM sdk_checkpoints
         WHERE ($1::text[] IS NULL OR agent_id = ANY($1))
           AND ($2::text[] IS NULL OR blob_id = ANY($2))`,
        any(filter.agentIds),
        any(filter.blobIds),
      );
    },
    async list(input) {
      const filter = input?.filter;
      const rows = await db.rawQueryAll<{ blob_id: string }>(
        `SELECT blob_id FROM sdk_checkpoints
         WHERE ($1::text[] IS NULL OR agent_id = ANY($1))
           AND ($2::text[] IS NULL OR blob_id = ANY($2))`,
        any(filter?.agentIds),
        any(filter?.blobIds),
      );
      return paginateCheckpointBlobIds(
        rows.map((r) => r.blob_id),
        filter,
      );
    },
  },

  runs: {
    async get({ agentId, runId }) {
      const row = await db.queryRow<Row<LocalAgentRunDocument>>`
        SELECT doc FROM sdk_runs WHERE run_id = ${runId} AND agent_id = ${agentId}`;
      return row ? json(row.doc) : null;
    },
    async create({ run }) {
      await db.exec`
        INSERT INTO sdk_runs (run_id, agent_id, turn_number, doc)
        VALUES (${run.runId}, ${run.agentId}, ${run.turnNumber}, ${JSON.stringify(run)}::text::jsonb)`;
      return run;
    },
    async update({ run }) {
      await db.exec`
        INSERT INTO sdk_runs (run_id, agent_id, turn_number, doc)
        VALUES (${run.runId}, ${run.agentId}, ${run.turnNumber}, ${JSON.stringify(run)}::text::jsonb)
        ON CONFLICT (run_id) DO UPDATE
          SET agent_id = EXCLUDED.agent_id, turn_number = EXCLUDED.turn_number, doc = EXCLUDED.doc`;
      return run;
    },
    async delete({ filter }) {
      await db.rawExec(
        `DELETE FROM sdk_runs
         WHERE ($1::text[] IS NULL OR agent_id = ANY($1))
           AND ($2::text[] IS NULL OR run_id = ANY($2))`,
        any(filter.agentIds),
        any(filter.runIds),
      );
    },
    async list(input) {
      const filter = input?.filter;
      const rows = await db.rawQueryAll<Row<LocalAgentRunDocument>>(
        `SELECT doc FROM sdk_runs
         WHERE ($1::text[] IS NULL OR agent_id = ANY($1))
           AND ($2::text[] IS NULL OR run_id = ANY($2))`,
        any(filter?.agentIds),
        any(filter?.runIds),
      );
      return paginateRunDocuments(
        rows.map((r) => json(r.doc)),
        filter,
      );
    },
  },

  runEvents: {
    async append({ runId, eventType, payload, payloadRef, idempotencyKey }) {
      // Sequence numbers are per run. An advisory lock on the run id keeps two
      // concurrent appends from claiming the same seq.
      const tx = await db.begin();
      try {
        await tx.exec`SELECT pg_advisory_xact_lock(hashtext(${runId}))`;

        let row = idempotencyKey
          ? await tx.queryRow<EventRow>`
              SELECT * FROM sdk_run_events
              WHERE run_id = ${runId} AND idempotency_key = ${idempotencyKey}`
          : null;

        row ??= await tx.queryRow<EventRow>`
          INSERT INTO sdk_run_events (run_id, seq, event_type, payload, payload_ref, idempotency_key, created_at)
          SELECT ${runId}, COALESCE(MAX(seq), 0) + 1, ${eventType},
                 ${payload === undefined ? null : JSON.stringify(payload)}::text::jsonb,
                 ${payloadRef ?? null}, ${idempotencyKey ?? null}, ${Date.now()}
          FROM sdk_run_events WHERE run_id = ${runId}
          RETURNING *`;

        await tx.commit();
        return toEvent(row!);
      } catch (err) {
        await tx.rollback();
        throw err;
      }
    },
    async list({ runId, afterOffset, limit }) {
      const after = afterOffset ? Number(afterOffset) : 0;
      const rows = await db.rawQueryAll<EventRow>(
        `SELECT * FROM sdk_run_events WHERE run_id = $1 AND seq > $2 ORDER BY seq LIMIT $3`,
        runId,
        after,
        limit ?? 1000,
      );
      const items = rows.map(toEvent);
      const last = items.at(-1);
      return last ? { items, nextOffset: last.offset } : { items };
    },
    async delete({ filter }) {
      await db.rawExec(
        `DELETE FROM sdk_run_events WHERE ($1::text[] IS NULL OR run_id = ANY($1))`,
        any(filter.runIds),
      );
    },
  },
};
