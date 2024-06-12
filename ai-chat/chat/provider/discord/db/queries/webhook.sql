-- name: InsertWebhook :one
INSERT INTO webhook (provider_id, channel, name, token, bot_id) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO UPDATE SET token = $4
RETURNING *;

-- name: GetWebhookForBot :one
SELECT * FROM webhook WHERE channel = $1 AND bot_id = $2 and deleted IS NULL;

-- name: GetWebhookByID :one
SELECT * FROM webhook WHERE provider_id=$1 and deleted IS NULL;

-- name: DeleteWebhook :one
UPDATE webhook SET deleted = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *;