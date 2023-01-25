package slack

import (
	"bytes"
	"context"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
)

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
