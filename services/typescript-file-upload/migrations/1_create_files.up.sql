-- One row per stored file. The bytes live in the bucket under the same name.
CREATE TABLE files (
    name         TEXT PRIMARY KEY,
    content_type TEXT NOT NULL,
    size         BIGINT NOT NULL,
    uploaded_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
