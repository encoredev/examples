-- name: InsertUser :one
INSERT INTO "user" (id, provider, provider_id, name, profile, bot_id) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5) RETURNING *;

-- name: ListUsers :many
SELECT * FROM "user";

-- name: ListUsersByProvider :many
SELECT * FROM "user" WHERE provider = $1;

-- name: ListUsersInChannel :many
WITH channel_users AS (
  SELECT distinct author_id FROM message WHERE channel_id = $1
)
SELECT * FROM "user" WHERE id IN (SELECT author_id FROM channel_users);

-- name: GetUser :one
SELECT * FROM "user" WHERE id = $1;