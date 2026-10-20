CREATE TABLE user_profile (
  clerk_user_id TEXT PRIMARY KEY,
  theme TEXT NOT NULL DEFAULT 'light',
  notifications BOOLEAN NOT NULL DEFAULT true,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
