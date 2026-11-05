// Package notes is a small typed API the agent calls as a tool.
package notes

import (
	"context"
	"errors"
	"sync"
	"time"
	"unicode/utf8"

	"encore.dev/beta/auth"
	"encore.dev/beta/errs"
	"encore.dev/storage/sqldb"
	"golang.org/x/time/rate"
)

var db = sqldb.NewDatabase("notes", sqldb.DatabaseConfig{Migrations: "./migrations"})

// maxNoteLen caps the length of a note in characters.
const maxNoteLen = 1000

// maxNotes caps how many notes each user can store.
const maxNotes = 100

// limiters holds a write rate limiter per user: 10 a minute with a burst of 3.
// It is in memory, so the limit is per instance.
var limiters sync.Map

func allowWrite(uid auth.UID) bool {
	l, _ := limiters.LoadOrStore(uid, rate.NewLimiter(rate.Every(time.Minute/10), 3))
	return l.(*rate.Limiter).Allow()
}

type Note struct {
	ID        int64     `json:"id"`
	Text      string    `json:"text"`
	CreatedAt time.Time `json:"created_at"`
}

type CreateParams struct {
	Text string `json:"text"`
}

// Create saves a note for the authenticated user. It is idempotent per user and text.
//
//encore:api auth method=POST path=/notes
func Create(ctx context.Context, p *CreateParams) (*Note, error) {
	if p.Text == "" {
		return nil, &errs.Error{Code: errs.InvalidArgument, Message: "text is required"}
	}
	if utf8.RuneCountInString(p.Text) > maxNoteLen {
		return nil, &errs.Error{Code: errs.InvalidArgument, Message: "note is too long"}
	}
	uid, _ := auth.UserID()
	if !allowWrite(uid) {
		return nil, &errs.Error{Code: errs.ResourceExhausted, Message: "rate limit exceeded"}
	}
	n := &Note{Text: p.Text}
	tx, err := db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()
	// A per-user lock held until commit makes the count and insert atomic.
	if _, err := tx.Exec(ctx, `SELECT pg_advisory_xact_lock(hashtext($1))`, uid); err != nil {
		return nil, err
	}
	// Saving the same text twice returns the existing note, so a retried turn can't duplicate it.
	err = tx.QueryRow(ctx, `SELECT id, created_at FROM notes WHERE user_id = $1 AND md5(text) = md5($2)`,
		uid, p.Text).Scan(&n.ID, &n.CreatedAt)
	if err == nil {
		return n, nil
	} else if !errors.Is(err, sqldb.ErrNoRows) {
		return nil, err
	}
	var count int
	if err := tx.QueryRow(ctx, `SELECT count(*) FROM notes WHERE user_id = $1`, uid).Scan(&count); err != nil {
		return nil, err
	}
	if count >= maxNotes {
		return nil, &errs.Error{Code: errs.ResourceExhausted, Message: "note limit reached"}
	}
	err = tx.QueryRow(ctx, `INSERT INTO notes (user_id, text) VALUES ($1, $2) RETURNING id, created_at`,
		uid, p.Text).Scan(&n.ID, &n.CreatedAt)
	if err != nil {
		return nil, err
	}
	return n, tx.Commit()
}

type ListResponse struct {
	Notes []*Note `json:"notes"`
}

// List returns the authenticated user's most recent notes.
//
//encore:api auth method=GET path=/notes
func List(ctx context.Context) (*ListResponse, error) {
	uid, _ := auth.UserID()
	rows, err := db.Query(ctx, `SELECT id, text, created_at FROM notes WHERE user_id = $1 ORDER BY id DESC LIMIT 50`, uid)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	resp := &ListResponse{Notes: []*Note{}}
	for rows.Next() {
		n := &Note{}
		if err := rows.Scan(&n.ID, &n.Text, &n.CreatedAt); err != nil {
			return nil, err
		}
		resp.Notes = append(resp.Notes, n)
	}
	return resp, rows.Err()
}
