CREATE TABLE IF NOT EXISTS bot(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    prompt TEXT NOT NULL,
    profile TEXT NOT NULL,
    provider TEXT NOT NULL,
    deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS avatar(
    bot_id INT PRIMARY KEY,
    avatar bytea NOT NULL
)