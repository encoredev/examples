package hello

import (
	"context"
	"testing"
)

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
