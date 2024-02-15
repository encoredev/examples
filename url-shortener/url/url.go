// Service url takes URLs, generates random short IDs, and stores the URLs in a database.
package url

import (
	"context"
	"crypto/rand"
	"encoding/base64"

	"encore.dev/storage/sqldb"
)

type URL struct {
	ID  string // short-form URL id
	URL string // complete URL, in long form
}

type ShortenParams struct {
	URL string // the URL to shorten
}

// Shorten shortens a URL.
//
//encore:api public method=POST path=/url
func Shorten(ctx context.Context, p *ShortenParams) (*URL, error) {
	id, err := generateID()
	if err != nil {
		return nil, err
	} else if err := insert(ctx, id, p.URL); err != nil {
		return nil, err
	}
	return &URL{ID: id, URL: p.URL}, nil
}

// generateID generates a random short ID.
func generateID() (string, error) {
	var data [6]byte // 6 bytes of entropy
	if _, err := rand.Read(data[:]); err != nil {
		return "", err
	}
	return base64.RawURLEncoding.EncodeToString(data[:]), nil
}

// insert inserts a URL into the database.
func insert(ctx context.Context, id, url string) error {
	_, err := db.Exec(ctx, `
        INSERT INTO url (id, original_url)
        VALUES ($1, $2)
    `, id, url)
	return err
}

// Get retrieves the original URL for the id.
//
//encore:api public method=GET path=/url/:id
func Get(ctx context.Context, id string) (*URL, error) {
	u := &URL{ID: id}
	err := db.QueryRow(ctx, `
        SELECT original_url FROM url
        WHERE id = $1
    `, id).Scan(&u.URL)
	return u, err
}

// Define a database named 'url', using the database
// migrations  in the "./migrations" folder.
// Encore provisions, migrates, and connects to the database.
// Learn more: https://encore.dev/docs/primitives/databases
var db = sqldb.NewDatabase("url", sqldb.DatabaseConfig{
	Migrations: "./migrations",
})
