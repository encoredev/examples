CREATE TABLE executions (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  language TEXT NOT NULL,
  code TEXT NOT NULL,
  output TEXT,
  error TEXT,
  exit_code INTEGER,
  execution_time_ms INTEGER,
  sandbox_id TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_executions_user ON executions(user_id, created_at DESC);
CREATE INDEX idx_executions_sandbox ON executions(sandbox_id);

