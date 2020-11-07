package hello

import (
	"context"
	"testing"
)

func TestWorld(t *testing.T) {
	resp, err := World(context.Background())
	if err != nil {
		t.Fatal(err)
	}
	want := "Hello, World!"
	if got := resp.Message; got != want {
		t.Errorf("got %q, want %q", got, want)
	}
}
