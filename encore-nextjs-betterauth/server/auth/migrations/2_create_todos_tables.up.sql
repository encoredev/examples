-- auth/migrations/1_create_auth_tables.up.sql
CREATE TABLE IF NOT EXISTS "todos" (
    "id" BIGSERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false
);
