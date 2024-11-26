package slack

import (
	"bytes"
	"context"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
)

// Run tests using `encore test`, which compiles the Encore app and then runs `go test`.
// It supports all the same flags that the `go test` command does.
// You automatically get tracing for tests in the local dev dash: http://localhost:9400
// Learn more: https://encore.dev/docs/go/develop/testing
func TestNotify(t *testing.T) {
	var payload []byte
	handler := func(w http.ResponseWriter, req *http.Request) {
		payload, _ = io.ReadAll(req.Body)
	}

	httpServer := httptest.NewServer(http.HandlerFunc(handler))
	t.Cleanup(httpServer.Close)

	svc := &Service{webhookURL: httpServer.URL}
	err := svc.Notify(context.Background(), &NotifyParams{
		Text: "TestNotify",
	})
	if err != nil {
		t.Fatal(err)
	}
	want := `{"text":"TestNotify"}`
	if !bytes.Equal(payload, []byte(want)) {
		t.Errorf("got payload %s, want %s", payload, want)
	}
}
