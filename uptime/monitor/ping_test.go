package monitor

import (
	"context"
	"testing"
)

func TestPing(t *testing.T) {
	ctx := context.Background()
	tests := []struct {
		URL string
		Up  bool
	}{
		{"encore.dev", true},
		{"google.com", true},
		// Test both with and without "https://"
		{"httpstat.us/200", true},
		{"https://httpstat.us/200", true},

		// 4xx and 5xx should considered down.
		{"httpstat.us/400", false},
		{"https://httpstat.us/500", false},
		// Invalid URLs should be considered down.
		{"invalid://scheme", false},
	}

	for _, test := range tests {
		resp, err := Ping(ctx, test.URL)
		if err != nil {
			t.Errorf("url %s: unexpected error: %v", test.URL, err)
		} else if resp.Up != test.Up {
			t.Errorf("url %s: got up=%v, want %v", test.URL, resp.Up, test.Up)
		}
	}
}
