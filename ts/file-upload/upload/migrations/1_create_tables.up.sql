CREATE TABLE files (
    name TEXT PRIMARY KEY,
    mime_type TEXT NOT NULL,
    data BYTEA NOT NULL
);
