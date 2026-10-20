package main

import (
	"context"
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"strconv"
	"strings"
	"time"

	"sdk.encore.dev/storage/postgres"
	"sdk.encore.dev/storage/postgres/sqlerr"
)

// db holds the monitored sites and the result of every check. Encore
// provisions it and applies ./migrations before the service starts.
var db = postgres.NewDatabase("{{ident}}", postgres.DatabaseConfig{
	Migrations: "migrations",
})

// maxSites caps how many sites can be monitored, to limit abuse.
const maxSites = 20

// Site is a monitored website.
type Site struct {
	ID int64 `json:"id"`
	// URL is the site's address. Without a scheme, it is checked over https.
	URL string `json:"url"`
}

func listSites(w http.ResponseWriter, r *http.Request) {
	sites, err := allSites(r.Context())
	if err != nil {
		internalError(w, r, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"sites": sites})
}

func addSite(w http.ResponseWriter, r *http.Request) {
	var in struct {
		URL string `json:"url"`
	}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil || strings.TrimSpace(in.URL) == "" {
		writeError(w, http.StatusBadRequest, `the body must be JSON like {"url": "example.com"}`)
		return
	}
	ctx := r.Context()

	var count int
	if err := db.QueryRow(ctx, "SELECT count(*) FROM sites").Scan(&count); err != nil {
		internalError(w, r, err)
		return
	}
	if count >= maxSites {
		writeError(w, http.StatusTooManyRequests, "too many sites: at most 20 can be monitored")
		return
	}

	site := Site{URL: strings.TrimSpace(in.URL)}
	err := db.QueryRow(ctx, "INSERT INTO sites (url) VALUES ($1) RETURNING id", site.URL).Scan(&site.ID)
	if postgres.ErrCode(err) == sqlerr.UniqueViolation {
		writeError(w, http.StatusConflict, "the site is already being monitored")
		return
	} else if err != nil {
		internalError(w, r, err)
		return
	}

	// Check the new site right away, without making the caller wait for it.
	go func() {
		ctx, cancel := context.WithTimeout(context.WithoutCancel(ctx), time.Minute)
		defer cancel()
		if _, err := check(ctx, site); err != nil {
			slog.ErrorContext(ctx, "checking a new site", "site", site.URL, "err", err)
		}
	}()

	writeJSON(w, http.StatusCreated, site)
}

func getSite(w http.ResponseWriter, r *http.Request) {
	site, ok := siteFromPath(w, r)
	if ok {
		writeJSON(w, http.StatusOK, site)
	}
}

func deleteSite(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil {
		writeError(w, http.StatusBadRequest, "the site id must be a number")
		return
	}
	// Its checks are deleted with it (ON DELETE CASCADE).
	res, err := db.Exec(r.Context(), "DELETE FROM sites WHERE id = $1", id)
	if err != nil {
		internalError(w, r, err)
		return
	}
	if res.RowsAffected() == 0 {
		writeError(w, http.StatusNotFound, "no such site")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// siteFromPath loads the site the request's {id} names, or answers the
// request with why it can't.
func siteFromPath(w http.ResponseWriter, r *http.Request) (Site, bool) {
	site := Site{}
	var err error
	site.ID, err = strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil {
		writeError(w, http.StatusBadRequest, "the site id must be a number")
		return site, false
	}
	err = db.QueryRow(r.Context(), "SELECT url FROM sites WHERE id = $1", site.ID).Scan(&site.URL)
	if errors.Is(err, postgres.ErrNoRows) {
		writeError(w, http.StatusNotFound, "no such site")
		return site, false
	} else if err != nil {
		internalError(w, r, err)
		return site, false
	}
	return site, true
}

func allSites(ctx context.Context) ([]Site, error) {
	rows, err := db.Query(ctx, "SELECT id, url FROM sites ORDER BY id")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	sites := []Site{}
	for rows.Next() {
		var s Site
		if err := rows.Scan(&s.ID, &s.URL); err != nil {
			return nil, err
		}
		sites = append(sites, s)
	}
	return sites, rows.Err()
}
