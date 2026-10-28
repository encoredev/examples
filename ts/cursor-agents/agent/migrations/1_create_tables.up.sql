-- ── Cursor SDK store ──────────────────────────────────────────────────────
-- Backing tables for PostgresAgentStore (store.ts). They mirror the SDK's own
-- SQLite layout: agent rows, content-addressed conversation checkpoints, run
-- rows, and an append-only run event log. Documents are stored as JSONB so the
-- store round-trips whatever the SDK writes.

CREATE TABLE sdk_agents (
    agent_id    TEXT PRIMARY KEY,
    cwd         TEXT NOT NULL,
    doc         JSONB NOT NULL,
    updated_at  BIGINT NOT NULL
);

CREATE TABLE sdk_checkpoints (
    agent_id  TEXT NOT NULL,
    blob_id   TEXT NOT NULL,
    data      BYTEA NOT NULL,
    PRIMARY KEY (agent_id, blob_id)
);

CREATE TABLE sdk_runs (
    run_id       TEXT PRIMARY KEY,
    agent_id     TEXT NOT NULL,
    turn_number  INT NOT NULL,
    doc          JSONB NOT NULL
);
CREATE INDEX sdk_runs_agent ON sdk_runs (agent_id, turn_number);

CREATE TABLE sdk_run_events (
    run_id           TEXT NOT NULL,
    seq              INT NOT NULL,
    event_type       TEXT NOT NULL,
    payload          JSONB,
    payload_ref      TEXT,
    idempotency_key  TEXT,
    created_at       BIGINT NOT NULL,
    PRIMARY KEY (run_id, seq)
);
CREATE UNIQUE INDEX sdk_run_events_idem ON sdk_run_events (run_id, idempotency_key)
    WHERE idempotency_key IS NOT NULL;

-- ── The chat ──────────────────────────────────────────────────────────────
-- What the UI shows. A thread is one Cursor agent (one conversation); a turn is
-- one prompt sent to it; turn_events is the normalized, replayable stream the
-- browser renders.

CREATE TABLE threads (
    id          TEXT PRIMARY KEY,
    title       TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE turns (
    id            TEXT PRIMARY KEY,
    thread_id     TEXT NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
    prompt        TEXT NOT NULL,
    status        TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'finished', 'error', 'cancelled')),
    result        TEXT,
    error         TEXT,
    model         TEXT,
    usage         JSONB,
    duration_ms   INT,
    -- Bumped every few seconds by the process running the turn. A turn is
    -- only reaped once this goes stale, which means that process is gone.
    heartbeat_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX turns_thread ON turns (thread_id, created_at);
-- One running turn per thread, so two messages sent at once can't both start
-- a run on the same agent.
CREATE UNIQUE INDEX turns_one_running ON turns (thread_id) WHERE status = 'running';

CREATE TABLE turn_events (
    id         BIGSERIAL PRIMARY KEY,
    thread_id  TEXT NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
    turn_id    TEXT NOT NULL REFERENCES turns(id) ON DELETE CASCADE,
    kind       TEXT NOT NULL,
    data       JSONB NOT NULL,
    at         TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX turn_events_thread ON turn_events (thread_id, id);
