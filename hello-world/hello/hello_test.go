package hello

import (
	"context"
	"strings"
	"testing"
)

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
