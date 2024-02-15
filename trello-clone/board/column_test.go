package board

import (
	"context"
	"testing"
)

// Run tests using `encore test`, which compiles the Encore app and then runs `go test`.
// It supports all the same flags that the `go test` command does.
// You automatically get tracing for tests in the local dev dash: http://localhost:9400
// Learn more: https://encore.dev/docs/develop/testing
func TestCreateColumn_Order(t *testing.T) {
	ctx := context.Background()
	board, err := Create(ctx, &CreateParams{
		Name: t.Name(),
	})
	if err != nil {
		t.Fatal(err)
	}

	c1, err := CreateColumn(ctx, &CreateColumnParams{BoardID: board.ID, Name: "c1"})
	if err != nil {
		t.Fatal(err)
	} else if c1.Order != 1 {
		t.Fatalf("c1: got order %d, want %d", c1.Order, 1)
	}

	c2, err := CreateColumn(ctx, &CreateColumnParams{
		BoardID: board.ID,
		Name:    "c2",
	})
	if err != nil {
		t.Fatal(err)
	} else if c2.Order != 2 {
		t.Fatalf("c2: got order %d, want %d", c2.Order, 2)
	}
}
