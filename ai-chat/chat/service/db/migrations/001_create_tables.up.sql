CREATE TABLE IF NOT EXISTS message (
    id uuid PRIMARY KEY,
    provider_id TEXT NOT NULL,
    channel_id uuid NOT NULL,
    author_id uuid NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    deleted TIMESTAMP DEFAULT NULL,
    UNIQUE (channel_id, author_id, content, timestamp)
);

-- create provider enum
CREATE TYPE provider AS ENUM ('slack', 'discord', 'admin', 'localchat');

CREATE TABLE IF NOT EXISTS "user" (
   id uuid PRIMARY KEY,
   provider provider NOT NULL,
   provider_id TEXT NOT NULL,
   name TEXT NOT NULL,
   profile TEXT NOT NULL,
   bot_id uuid DEFAULT NULL
);

INSERT INTO "user" (id, provider, provider_id, name, profile)
VALUES ('00000000-0000-0000-0000-000000000000',
        'admin',
        'admin',
        'Admin',
        '');


CREATE TABLE IF NOT EXISTS channel (
    id uuid PRIMARY KEY,
    provider_id TEXT NOT NULL,
    provider provider NOT NULL,
    name TEXT NOT NULL,
    deleted TIMESTAMP DEFAULT NULL,
    unique (provider_id, provider)
);

CREATE TABLE IF NOT EXISTS bot_channel (
    bot uuid NOT NULL,
    channel uuid NOT NULL,
    provider provider NOT NULL,
    deleted TIMESTAMP DEFAULT NULL,
    PRIMARY KEY (bot, channel)
);