-- name: InsertAvatar :exec
INSERT INTO avatar (bot_id, avatar) VALUES ($1, $2);

-- name: GetAvatar :one
SELECT * FROM avatar WHERE bot_id = $1;