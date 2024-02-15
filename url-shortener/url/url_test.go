package url

import (
	"context"
	"testing"
)

// Run tests using `encore test`, which compiles the Encore app and then runs `go test`.
// It supports all the same flags that the `go test` command does.
// You automatically get tracing for tests in the local dev dash: http://localhost:9400
// Learn more: https://encore.dev/docs/develop/testing
//
// TestShortenAndRetrieve - test that the shortened URL is stored and retrieved from database.
func TestShortenAndRetrieve(t *testing.T) {
	testURL := "https://github.com/encoredev/encore"
	sp := ShortenParams{URL: testURL}
	resp, err := Shorten(context.Background(), &sp)
	if err != nil {
		t.Fatal(err)
	}
	wantURL := testURL
	if resp.URL != wantURL {
		t.Errorf("got %q, want %q", resp.URL, wantURL)
	}

	firstURL := resp
	gotURL, err := Get(context.Background(), firstURL.ID)
	if err != nil {
		t.Fatal(err)
	}
	if *gotURL != *firstURL {
		t.Errorf("got %v, want %v", *gotURL, *firstURL)
	}
}
