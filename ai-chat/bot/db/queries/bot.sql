-- name: InsertBot :one
INSERT INTO bot (id, name, prompt, profile, provider) VALUES (gen_random_uuid(), $1, $2, $3, $4) RETURNING *;

-- name: ListBot :many
SELECT * FROM bot WHERE deleted IS NULL;

-- name: DeleteBot :one
UPDATE bot SET deleted = NOW() WHERE id = $1 RETURNING *;

-- name: GetBot :one
SELECT * FROM bot WHERE id = $1 AND deleted IS NULL;

-- name: GetBots :many
SELECT * FROM bot WHERE id = ANY(@ids::uuid[]) AND deleted IS NULL;

-- name: GetBotByName :one
SELECT * FROM bot WHERE name = $1 AND deleted IS NULL;