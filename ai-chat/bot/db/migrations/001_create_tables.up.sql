CREATE TABLE IF NOT EXISTS bot(
    id uuid PRIMARY KEY,
    name TEXT NOT NULL,
    prompt TEXT NOT NULL,
    profile TEXT NOT NULL,
    provider TEXT NOT NULL,
    deleted TIMESTAMP DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS avatar(
    bot_id uuid PRIMARY KEY,
    avatar bytea NOT NULL
)