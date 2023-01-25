package site

import (
	"context"
	"testing"
)

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
