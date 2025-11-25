CREATE TABLE files (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  content_type TEXT NOT NULL,
  uploaded_by TEXT NOT NULL,
  storage_key TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_files_uploaded_by ON files(uploaded_by);
CREATE INDEX idx_files_expires_at ON files(expires_at);

