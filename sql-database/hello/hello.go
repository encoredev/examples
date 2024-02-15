// Service hello implements a simple hello world example with a sql database.
package hello

import (
	"context"
	"fmt"

	"encore.dev/storage/sqldb"
)

type ThereParams struct {
	// Name is the name of the person.
	Name string
}

type ThereResponse struct {
	// Message is the greeting response.
	Message string
}

// There responds with a personalized greeting.
//
//encore:api public
func There(ctx context.Context, params *ThereParams) (*ThereResponse, error) {
	message, err := generateGreeting(ctx, params.Name)
	if err != nil {
		return nil, err
	}
	return &ThereResponse{Message: message}, nil
}

func generateGreeting(ctx context.Context, name string) (greeting string, err error) {
	var count int
	err = db.QueryRow(ctx, `
		INSERT INTO people (name, count)
		VALUES ($1, 1)
		ON CONFLICT (name) DO UPDATE
		SET count = people.count + 1
		RETURNING count
	`, name).Scan(&count)
	if err != nil {
		return "", fmt.Errorf("could not update people table: %v", err)
	}
	if count == 1 {
		return fmt.Sprintf("Nice to meet you, %s.", name), nil
	}
	return fmt.Sprintf("Hey again, %s! We've met %d time(s) before.", name, count-1), nil
}

// Define a database named 'hello', using the database migrations
// in the "./migrations" folder. Encore automatically provisions,
// migrates, and connects to the database.
// Learn more: https://encore.dev/docs/primitives/databases
var db = sqldb.NewDatabase("hello", sqldb.DatabaseConfig{
	Migrations: "./migrations",
})
