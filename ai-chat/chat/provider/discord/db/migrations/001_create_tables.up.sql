CREATE TABLE webhook
(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id      TEXT NOT NULL ,
    bot_id          uuid NOT NULL,
    channel TEXT NOT NULL,
    name    TEXT NOT NULL,
    token  TEXT NOT NULL,
    deleted TIMESTAMP DEFAULT NULL
)