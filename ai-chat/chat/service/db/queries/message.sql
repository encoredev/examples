-- name: InsertMessage :one
INSERT INTO message (id, provider_id, channel_id, author_id, content, timestamp)
VALUES (gen_random_uuid (), $1, $2, $3, $4, $5)
ON CONFLICT (channel_id, author_id, content, timestamp) DO NOTHING
RETURNING *;

-- name: LatestMessageInChannel :one
SELECT m.* FROM message m WHERE m.channel_id = $1
ORDER BY timestamp DESC LIMIT 1;

-- name: LatestBotMessageInChannel :one
SELECT m.* FROM message m join "user" u on m.author_id = u.id WHERE m.channel_id = $1 AND u.bot_id IS NOT NULL
ORDER BY timestamp DESC LIMIT 1;

-- name: ListMessagesInChannel :many
SELECT * FROM message m WHERE m.channel_id = $1 and timestamp > NOW() - interval '3 days' order by timestamp desc LIMIT 25;

-- name: ListMessagesInChannelAfter :many
WITH targetTimestamp AS (
    SELECT timestamp FROM message m WHERE m.provider_id = $2
)
SELECT * FROM message m WHERE m.channel_id = $1 and timestamp > (select timestamp from targetTimestamp) order by timestamp;