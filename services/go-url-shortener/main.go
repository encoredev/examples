// A URL shortener: it gives each URL a random short id and stores both in a
// Postgres database.
//
//	POST /{{name}}/url       shorten {"url": "https://..."}, returning {"id": "...", "url": "..."}
//	GET  /{{name}}/url/{id}  get the URL a short id stands for
//	GET  /{{name}}/url       list every shortened URL
package main

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"net/url"
	"os"

	"sdk.encore.dev/env"
	"sdk.encore.dev/shutdown"
	"sdk.encore.dev/storage/postgres"
)

const service = "{{name}}"

// db stores the shortened URLs. Encore provisions it and applies the
// migrations in ./migrations before the service starts.
var db = postgres.NewDatabase("{{ident}}", postgres.DatabaseConfig{
	Migrations: "migrations",
})

// URL is a shortened URL.
type URL struct {
	ID  string `json:"id"`  // the short id
	URL string `json:"url"` // the complete URL, in long form
}

func main() {
	slog.SetDefault(slog.New(env.NewLogHandler(&env.LogHandlerOptions{Name: service})))

	mux := http.NewServeMux()
	prefix := "/" + service + "/url"
	mux.HandleFunc("POST "+prefix, shorten)
	mux.HandleFunc("GET "+prefix+"/{id}", get)
	mux.HandleFunc("GET "+prefix, list)

	addr := listenAddr()
	srv := &http.Server{Addr: addr, Handler: mux}
	// On shutdown, finish the requests in flight before Encore closes the database.
	shutdown.OnShutdown(srv.Shutdown)

	slog.Info("listening", "service", service, "addr", addr)
	if err := srv.ListenAndServe(); !errors.Is(err, http.ErrServerClosed) {
		slog.Error("serving", "err", err)
		os.Exit(1)
	}
	// Encore exits once the shutdown completes.
	select {}
}

// shorten stores a URL under a new random short id.
func shorten(w http.ResponseWriter, r *http.Request) {
	var in struct {
		URL string `json:"url"`
	}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		writeError(w, http.StatusBadRequest, `the body must be JSON like {"url": "https://..."}`)
		return
	}
	if u, err := url.ParseRequestURI(in.URL); err != nil || (u.Scheme != "http" && u.Scheme != "https") || u.Host == "" {
		writeError(w, http.StatusBadRequest, "url must be an absolute http or https URL")
		return
	}

	id, err := generateID()
	if err != nil {
		internalError(r.Context(), w, "generating an id", err)
		return
	}
	if _, err := db.Exec(r.Context(), `
		INSERT INTO url (id, original_url)
		VALUES ($1, $2)
	`, id, in.URL); err != nil {
		internalError(r.Context(), w, "storing the url", err)
		return
	}
	writeJSON(w, http.StatusCreated, URL{ID: id, URL: in.URL})
}

// generateID generates a random short id: 6 random bytes, base64url-encoded
// into 8 characters.
func generateID() (string, error) {
	var data [6]byte
	if _, err := rand.Read(data[:]); err != nil {
		return "", err
	}
	return base64.RawURLEncoding.EncodeToString(data[:]), nil
}

// get returns the URL a short id stands for.
func get(w http.ResponseWriter, r *http.Request) {
	u := URL{ID: r.PathValue("id")}
	err := db.QueryRow(r.Context(), `
		SELECT original_url FROM url
		WHERE id = $1
	`, u.ID).Scan(&u.URL)
	switch {
	case errors.Is(err, postgres.ErrNoRows):
		writeError(w, http.StatusNotFound, "no url with that id")
	case err != nil:
		internalError(r.Context(), w, "reading the url", err)
	default:
		writeJSON(w, http.StatusOK, u)
	}
}

// list returns every shortened URL.
func list(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query(r.Context(), `
		SELECT id, original_url FROM url
		ORDER BY id
	`)
	if err != nil {
		internalError(r.Context(), w, "listing the urls", err)
		return
	}
	defer rows.Close()

	urls := []URL{}
	for rows.Next() {
		var u URL
		if err := rows.Scan(&u.ID, &u.URL); err != nil {
			internalError(r.Context(), w, "listing the urls", err)
			return
		}
		urls = append(urls, u)
	}
	if err := rows.Err(); err != nil {
		internalError(r.Context(), w, "listing the urls", err)
		return
	}
	writeJSON(w, http.StatusOK, map[string][]URL{"urls": urls})
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	enc := json.NewEncoder(w)
	// Keep the URLs readable: no & for &.
	enc.SetEscapeHTML(false)
	if err := enc.Encode(v); err != nil {
		slog.Error("writing response", "err", err)
	}
}

func writeError(w http.ResponseWriter, status int, msg string) {
	writeJSON(w, status, map[string]string{"error": msg})
}

// internalError logs err and answers 500 without exposing its details.
func internalError(ctx context.Context, w http.ResponseWriter, what string, err error) {
	slog.ErrorContext(ctx, what, "err", err)
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
