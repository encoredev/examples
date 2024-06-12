-- name: ListChannels :many
SELECT * FROM channel WHERE deleted IS NULL;

-- name: ListChannelsByProvider :many
SELECT * FROM channel WHERE deleted IS NULL AND provider = @provider;

-- name: GetChannel :one
SELECT * FROM channel WHERE id = @id AND deleted IS NULL;

-- name: GetChannelByProviderId :one
SELECT * FROM channel WHERE provider_id = @provider_id AND provider = @provider AND deleted IS NULL;

-- name: UpsertChannel :one
INSERT INTO channel (id, provider_id, provider, name)
SELECT coalesce(id, new_id), @provider_id, @provider, @name
FROM (VALUES(gen_random_uuid())) AS data(new_id) LEFT JOIN channel c
ON c.provider = @provider AND c.provider_id = @provider_id
ON CONFLICT(provider_id, provider) DO UPDATE SET name = @name
RETURNING *;

-- name: GetChannelByProviderID :one
SELECT * FROM channel WHERE provider_id = @provider_id AND provider = @provider AND deleted IS NULL;

-- name: ListChannelsWithBots :many
WITH channelIds AS (
    SELECT distinct channel as id FROM bot_channel WHERE deleted IS NULL
)
SELECT * FROM channel WHERE id IN (SELECT id FROM channelIds) AND deleted IS NULL;

-- name: UpsertBotChannel :one
INSERT INTO bot_channel (bot, channel, provider) VALUES ($1, $2, $3) ON CONFLICT (bot, channel) DO UPDATE SET deleted = NULL RETURNING bot;

-- name: RemoveBotChannel :one
UPDATE bot_channel SET deleted = NOW() WHERE bot = $1 AND channel = $2 RETURNING bot;

-- name: GetBotChannel :one
SELECT bot FROM bot_channel WHERE bot = $1 AND channel = $2 AND deleted IS NULL;

-- name: ListBotsInChannel :many
SELECT bot FROM bot_channel WHERE channel = $1 AND deleted IS NULL;