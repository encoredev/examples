// A webhook processor: it receives webhooks, verifies their signatures, and
// queues them on a Pub/Sub topic. Two subscriptions handle each one
// independently (fan-out): one stores every event, the other keeps the
// important ones as notifications.
//
//	POST /{{name}}/webhooks/{source}   receive a webhook from stripe, github or any other source
//	GET  /{{name}}/events              the 50 most recent events
//	GET  /{{name}}/events/{id}         one event
//	GET  /{{name}}/notifications       the 50 most recent important events
//	GET  /{{name}}/notifications/stats how many notifications there are of each event type
package main

import (
	"encoding/json"
	"errors"
	"log"
	"log/slog"
	"net/http"
	"os"

	encore "sdk.encore.dev"
	"sdk.encore.dev/env"
	"sdk.encore.dev/shutdown"
)

const service = "{{name}}"

func main() {
	slog.SetDefault(slog.New(env.NewLogHandler(&env.LogHandlerOptions{Name: service})))
	// Start the subscriptions declared in events.go.
	encore.Start()

	mux := http.NewServeMux()
	prefix := "/" + service
	mux.HandleFunc("POST "+prefix+"/webhooks/{source}", receive)
	mux.HandleFunc("GET "+prefix+"/events", listEvents)
	mux.HandleFunc("GET "+prefix+"/events/{id}", getEvent)
	mux.HandleFunc("GET "+prefix+"/notifications", listNotifications)
	mux.HandleFunc("GET "+prefix+"/notifications/stats", notificationStats)

	addr := listenAddr()
	slog.Info("listening", "service", service, "addr", addr)
	srv := &http.Server{Addr: addr, Handler: mux}
	// On SIGTERM, Encore waits for the server to drain before closing the database.
	shutdown.OnShutdown(srv.Shutdown)
	if err := srv.ListenAndServe(); !errors.Is(err, http.ErrServerClosed) {
		log.Fatal(err)
	}
	// Encore exits once the shutdown completes.
	select {}
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(v); err != nil {
		slog.Error("writing response", "err", err)
	}
}

func writeError(w http.ResponseWriter, status int, msg string) {
	writeJSON(w, status, map[string]string{"error": msg})
}

// listenAddr is where to serve. Encore's local run supplies
// ENCORE_LISTEN_ADDR; run on its own, this falls back to PORT and then to 8080.
func listenAddr() string {
	if addr := os.Getenv("ENCORE_LISTEN_ADDR"); addr != "" {
		return addr
	}
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	return ":" + port
}
