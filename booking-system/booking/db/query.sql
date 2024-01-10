-- name: GetAvailability :many
SELECT * FROM availability
ORDER BY weekday;

-- name: UpdateAvailability :exec
INSERT INTO availability (weekday, start_time, end_time)
VALUES (@weekday, @start_time, @end_time)
ON CONFLICT (weekday) DO UPDATE
SET start_time = @start_time, end_time = @end_time;

-- name: InsertBooking :one
INSERT INTO booking (start_time, end_time, email)
VALUES ($1, $2, $3)
RETURNING *;

-- name: ListBookingsBetween :many
SELECT * FROM booking
WHERE start_time >= $1 AND end_time <= $2;

-- name: ListBookings :many
SELECT * FROM booking;

-- name: DeleteBooking :exec
DELETE FROM booking WHERE id = $1;
