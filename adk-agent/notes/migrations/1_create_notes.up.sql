CREATE TABLE notes (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX notes_user_id_idx ON notes (user_id, id DESC);

-- One row per user and text, so a retried add_note returns the existing note.
CREATE UNIQUE INDEX notes_user_text_idx ON notes (user_id, md5(text));
