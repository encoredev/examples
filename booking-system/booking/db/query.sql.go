// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.20.0
// source: query.sql

package db

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
)

const getAvailability = `-- name: GetAvailability :many
SELECT weekday, start_time, end_time FROM availability
ORDER BY weekday
`

func (q *Queries) GetAvailability(ctx context.Context) ([]Availability, error) {
	rows, err := q.db.Query(ctx, getAvailability)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Availability
	for rows.Next() {
		var i Availability
		if err := rows.Scan(&i.Weekday, &i.StartTime, &i.EndTime); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const insertBooking = `-- name: InsertBooking :one
INSERT INTO booking (start_time, end_time, email)
VALUES ($1, $2, $3)
RETURNING id, start_time, end_time, email, created_at
`

type InsertBookingParams struct {
	StartTime pgtype.Timestamp
	EndTime   pgtype.Timestamp
	Email     string
}

func (q *Queries) InsertBooking(ctx context.Context, arg InsertBookingParams) (Booking, error) {
	row := q.db.QueryRow(ctx, insertBooking, arg.StartTime, arg.EndTime, arg.Email)
	var i Booking
	err := row.Scan(
		&i.ID,
		&i.StartTime,
		&i.EndTime,
		&i.Email,
		&i.CreatedAt,
	)
	return i, err
}

const listBookings = `-- name: ListBookings :many
SELECT id, start_time, end_time, email, created_at FROM booking
`

func (q *Queries) ListBookings(ctx context.Context) ([]Booking, error) {
	rows, err := q.db.Query(ctx, listBookings)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Booking
	for rows.Next() {
		var i Booking
		if err := rows.Scan(
			&i.ID,
			&i.StartTime,
			&i.EndTime,
			&i.Email,
			&i.CreatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const listBookingsBetween = `-- name: ListBookingsBetween :many
SELECT id, start_time, end_time, email, created_at FROM booking
WHERE start_time >= $1 AND end_time <= $2
`

type ListBookingsBetweenParams struct {
	StartTime pgtype.Timestamp
	EndTime   pgtype.Timestamp
}

func (q *Queries) ListBookingsBetween(ctx context.Context, arg ListBookingsBetweenParams) ([]Booking, error) {
	rows, err := q.db.Query(ctx, listBookingsBetween, arg.StartTime, arg.EndTime)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Booking
	for rows.Next() {
		var i Booking
		if err := rows.Scan(
			&i.ID,
			&i.StartTime,
			&i.EndTime,
			&i.Email,
			&i.CreatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const updateAvailability = `-- name: UpdateAvailability :exec
INSERT INTO availability (weekday, start_time, end_time)
VALUES ($1, $2, $3)
ON CONFLICT (weekday) DO UPDATE
SET start_time = $2, end_time = $3
`

type UpdateAvailabilityParams struct {
	Weekday   int16
	StartTime pgtype.Time
	EndTime   pgtype.Time
}

func (q *Queries) UpdateAvailability(ctx context.Context, arg UpdateAvailabilityParams) error {
	_, err := q.db.Exec(ctx, updateAvailability, arg.Weekday, arg.StartTime, arg.EndTime)
	return err
}
