package note

import (
	"context"
	"encore.dev/storage/sqldb"
)

// Type that represents a note.
type Note struct {
	ID       string `json:"id"`
	Text     string `json:"text"`
	CoverURL string `json:"cover_url"`
}

//encore:api public method=POST path=/note
func SaveNote(ctx context.Context, note *Note) (*Note, error) {
	// Save the note to the database.
	// If the note already exists (i.e. CONFLICT), we update the notes text and the cover URL.
	_, err := sqldb.Exec(ctx, `
		INSERT INTO note (id, text, cover_url) VALUES ($1, $2, $3)
		ON CONFLICT (id) DO UPDATE SET text=$2, cover_url=$3
	`, note.ID, note.Text, note.CoverURL)

	// If there was an error saving to the database, then we return that error.
	if err != nil {
		return nil, err
	}

	// Otherwise, we return the note to indicate that the save was successful.
	return note, nil
}

//encore:api public method=GET path=/note/:id
func GetNote(ctx context.Context, id string) (*Note, error) {
	note := &Note{ID: id}

	// We use the note ID to query the database for the note's text and cover URL.
	err := sqldb.QueryRow(ctx, `
		SELECT text, cover_url FROM note
		WHERE id = $1
	`, id).Scan(&note.Text, &note.CoverURL)

	// If the note doesn't exist, we return an error.
	if err != nil {
		return nil, err
	}

	// Otherwise, we return the note.
	return note, nil
}
