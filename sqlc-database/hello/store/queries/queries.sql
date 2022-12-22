-- name: IncrementMeetingCount :one
INSERT INTO
    people (name, count)
VALUES
    (@name :: TEXT, 1)
ON CONFLICT (name) DO
UPDATE SET
    count = people.count + 1
RETURNING count;
