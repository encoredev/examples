// An uptime monitor: it keeps a list of websites, checks whether each is up,
// and posts to Slack when one goes down or comes back up.
//
//	GET    /{{name}}/sites            list the monitored sites
//	POST   /{{name}}/sites            monitor a site, from {"url": "..."}
//	GET    /{{name}}/sites/{id}       get one site
//	DELETE /{{name}}/sites/{id}       stop monitoring a site
//	POST   /{{name}}/sites/{id}/check check one site now
//	POST   /{{name}}/check-all        check every site (the cron job runs this hourly)
//	GET    /{{name}}/status           each site's most recent check
//	GET    /{{name}}/ping/{url...}    check any URL once, without recording it
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
	// Start the Pub/Sub subscription that notifies Slack.
	encore.Start()

	mux := http.NewServeMux()
	prefix := "/" + service
	mux.HandleFunc("GET "+prefix+"/sites", listSites)
	mux.HandleFunc("POST "+prefix+"/sites", addSite)
	mux.HandleFunc("GET "+prefix+"/sites/{id}", getSite)
	mux.HandleFunc("DELETE "+prefix+"/sites/{id}", deleteSite)
	mux.HandleFunc("POST "+prefix+"/sites/{id}/check", checkSite)
	// The cron job's path, in check.go.
	mux.HandleFunc("POST "+prefix+"/check-all", checkAll)
	mux.HandleFunc("GET "+prefix+"/status", status)
	mux.HandleFunc("GET "+prefix+"/ping/{url...}", pingURL)

	addr := listenAddr()
	slog.Info("listening", "service", service, "addr", addr)
	srv := &http.Server{Addr: addr, Handler: mux}
	// On SIGTERM, Encore drains the server before it closes the database.
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

// internalError logs err and answers 500 without revealing it.
func internalError(w http.ResponseWriter, r *http.Request, err error) {
	slog.ErrorContext(r.Context(), "request failed", "path", r.URL.Path, "err", err)
	writeError(w, http.StatusInternalServerError, "internal error")
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
