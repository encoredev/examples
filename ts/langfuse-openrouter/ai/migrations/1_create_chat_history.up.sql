CREATE TABLE chat_messages (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  model TEXT NOT NULL,
  langfuse_trace_id TEXT,
  tokens_used INTEGER,
  cost_usd DECIMAL(10, 6),
  latency_ms INTEGER,
  rating INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_session ON chat_messages(session_id, created_at);
CREATE INDEX idx_messages_trace ON chat_messages(langfuse_trace_id);
CREATE INDEX idx_messages_user ON chat_messages(user_id, created_at DESC);

