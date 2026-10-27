-- One running turn per thread, enforced by the database so two messages sent
-- at once can't both start a run on the same agent.
CREATE UNIQUE INDEX turns_one_running ON turns (thread_id) WHERE status = 'running';

-- One triage thread per incident, so a redelivered incident-opened message
-- doesn't start a second run.
CREATE UNIQUE INDEX threads_one_triage ON threads (incident_id) WHERE trigger = 'incident';

-- Bumped every few seconds by the process running the turn. A turn is only
-- reaped once this goes stale, which means that process is gone.
ALTER TABLE turns ADD COLUMN heartbeat_at TIMESTAMPTZ NOT NULL DEFAULT now();
