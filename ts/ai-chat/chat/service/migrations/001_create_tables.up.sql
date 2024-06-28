CREATE TABLE IF NOT EXISTS message (
    id SERIAL PRIMARY KEY,
    provider_id TEXT NOT NULL,
    channel_id INT NOT NULL,
    author_id INT NOT NULL,
    content TEXT NOT NULL,
    timestamp float NOT NULL,
    deleted BOOLEAN DEFAULT false,
    UNIQUE (channel_id, author_id, content, timestamp)
);

-- create provider enum
CREATE TYPE provider AS ENUM ('slack');

CREATE TABLE IF NOT EXISTS "user" (
   id SERIAL PRIMARY KEY,
   provider provider NOT NULL,
   provider_id TEXT NOT NULL,
   name TEXT NOT NULL,
   profile TEXT NULL,
   bot_id INT DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS channel (
    id SERIAL PRIMARY KEY,
    provider_id TEXT NOT NULL,
    provider provider NOT NULL,
    name TEXT NOT NULL,
    deleted BOOLEAN DEFAULT FALSE,
    unique (provider_id, provider)
);

CREATE TABLE IF NOT EXISTS bot_channel (
    bot_id INT NOT NULL,
    channel_id INT NOT NULL,
    deleted BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (bot_id, channel_id)
);