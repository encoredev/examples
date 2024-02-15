package card

import (
	"context"
	"testing"
)

// Run tests using `encore test`, which compiles the Encore app and then runs `go test`.
// It supports all the same flags that the `go test` command does.
// You automatically get tracing for tests in the local dev dash: http://localhost:9400
// Learn more: https://encore.dev/docs/develop/testing
func TestCreate_Order(t *testing.T) {
	ctx := context.Background()
	c1, err1 := Create(ctx, &CreateParams{BoardID: 1, ColumnID: 1})
	c2, err2 := Create(ctx, &CreateParams{BoardID: 1, ColumnID: 1})
	if err1 != nil || err2 != nil {
		t.Fatalf("could not create: %v %v", err1, err2)
	} else if c1.Order != 1 {
		t.Fatalf("c1: got order %d, want 1", c1.Order)
	} else if c2.Order != 2 {
		t.Fatalf("c2: got order %d, want 2", c2.Order)
	}
}
