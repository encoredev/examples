package site

import (
	"context"
	"testing"
)

// Run tests using `encore test`, which compiles the Encore app and then runs `go test`.
// It supports all the same flags that the `go test` command does.
// You automatically get tracing for tests in the local dev dash: http://localhost:9400
// Learn more: https://encore.dev/docs/go/develop/testing
func TestAdd(t *testing.T) {
	svc, err := initService()
	if err != nil {
		t.Fatal(err)
	}

	ctx := context.Background()
	params := &AddParams{
		URL: "https://example.org",
	}
	site, err := svc.Add(ctx, params)
	if err != nil {
		t.Fatal(err)
	} else if site.URL != params.URL {
		t.Errorf("got site %+v, want %+v", *site, *params)
	} else if site.ID <= 0 {
		t.Errorf("got id %d, want positive integer", site.ID)
	}
}
