CREATE TABLE emails (
  id TEXT PRIMARY KEY,
  resend_id TEXT UNIQUE,
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  template TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  delivered_at TIMESTAMP,
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP,
  bounced_at TIMESTAMP,
  complained_at TIMESTAMP,
  error TEXT,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_emails_recipient ON emails(recipient, created_at DESC);
CREATE INDEX idx_emails_status ON emails(status);
CREATE INDEX idx_emails_resend_id ON emails(resend_id);

