package hello

import (
	"context"
	"testing"
)

// Run tests using `encore test`, which compiles the Encore app and then runs `go test`.
// It supports all the same flags that the `go test` command does.
// You automatically get tracing for tests in the local dev dash: http://localhost:9400
// Learn more: https://encore.dev/docs/develop/testing
func TestThere(t *testing.T) {
	resp, err := There(context.Background(), &ThereParams{Name: "World"})
	if err != nil {
		t.Fatal(err)
	}
	want := "Nice to meet you, World."
	if got := resp.Message; got != want {
		t.Errorf("got %q, want %q", got, want)
	}

	resp, err = There(context.Background(), &ThereParams{Name: "World"})
	if err != nil {
		t.Fatal(err)
	}
	want = "Hey again, World! We've met 1 time(s) before."
	if got := resp.Message; got != want {
		t.Errorf("got %q, want %q", got, want)
	}
}
