CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  display_name TEXT,
  profile_picture_url TEXT,
  external_id TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);