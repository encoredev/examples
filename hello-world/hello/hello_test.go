package hello

import (
	"context"
	"strings"
	"testing"
)

// Run tests using `encore test`, which compiles the Encore app and then runs `go test`.
// It supports all the same flags that the `go test` command does.
// You automatically get tracing for tests in the local dev dash: http://localhost:9400
// Learn more: https://encore.dev/docs/develop/testing
func TestWorld(t *testing.T) {
	const in = "Jane Doe"
	resp, err := World(context.Background(), in)
	if err != nil {
		t.Fatal(err)
	}
	if got := resp.Message; !strings.Contains(got, in) {
		t.Errorf("World(%q) = %q, expected to contain %q", in, got, in)
	}
}
