package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"strings"
	"sync"
	"time"

	"sdk.encore.dev/cron"
	"sdk.encore.dev/pubsub"
	"sdk.encore.dev/storage/postgres"
)

// The cron job checks every site once an hour. Encore sends a POST for its
// path when it is due; locally nothing runs it, so POST the path yourself.
// Encore reads the path from the source, so it is a literal: keep it and the
// route in main.go the same.
var _ = cron.NewJob("{{kebab}}-check-all", cron.JobConfig{
	Title: "Check all sites",
	Path:  "/{{name}}/check-all",
	Every: 1 * cron.Hour,
})

// TransitionEvent says a site went from up to down, or from down to up.
type TransitionEvent struct {
	Site Site `json:"site"`
	// Up is whether the site is up now.
	Up bool `json:"up"`
}

// transitions carries a TransitionEvent each time a check finds a site's
// status changed. The Slack notification subscribes to it.
var transitions = pubsub.NewTopic[*TransitionEvent]("{{kebab}}-transition", pubsub.TopicConfig{})

// pingClient gives up on a site that takes longer than this to answer.
var pingClient = &http.Client{Timeout: 10 * time.Second}

// ping reports whether url answers a GET without an error status. A url
// without a scheme is requested over https.
func ping(ctx context.Context, url string) bool {
	if !strings.HasPrefix(url, "http:") && !strings.HasPrefix(url, "https:") {
		url = "https://" + url
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return false
	}
	resp, err := pingClient.Do(req)
	if err != nil {
		return false
	}
	resp.Body.Close()
	return resp.StatusCode < 400
}

// check pings site, publishes a TransitionEvent if its status changed since
// the last check, and records the check.
func check(ctx context.Context, site Site) (up bool, err error) {
	up = ping(ctx, site.URL)

	// A site never checked before counts as having been up.
	wasUp := true
	err = db.QueryRow(ctx, `
		SELECT up FROM checks
		WHERE site_id = $1
		ORDER BY checked_at DESC
		LIMIT 1
	`, site.ID).Scan(&wasUp)
	if err != nil && !errors.Is(err, postgres.ErrNoRows) {
		return false, err
	}
	if up != wasUp {
		if _, err := transitions.Publish(ctx, &TransitionEvent{Site: site, Up: up}); err != nil {
			return false, err
		}
	}

	_, err = db.Exec(ctx, `
		INSERT INTO checks (site_id, up, checked_at)
		VALUES ($1, $2, NOW())
	`, site.ID, up)
	return up, err
}

func checkSite(w http.ResponseWriter, r *http.Request) {
	site, ok := siteFromPath(w, r)
	if !ok {
		return
	}
	up, err := check(r.Context(), site)
	if err != nil {
		internalError(w, r, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]bool{"up": up})
}

// checkAll checks every site, up to 8 at a time.
func checkAll(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	sites, err := allSites(ctx)
	if err != nil {
		internalError(w, r, err)
		return
	}

	var (
		wg    sync.WaitGroup
		mu    sync.Mutex
		errs  []error
		limit = make(chan struct{}, 8)
	)
	for _, site := range sites {
		wg.Go(func() {
			limit <- struct{}{}
			defer func() { <-limit }()
			if _, err := check(ctx, site); err != nil {
				mu.Lock()
				errs = append(errs, err)
				mu.Unlock()
			}
		})
	}
	wg.Wait()
	if err := errors.Join(errs...); err != nil {
		internalError(w, r, err)
		return
	}
	slog.InfoContext(ctx, "checked all sites", "count", len(sites))
	writeJSON(w, http.StatusOK, map[string]int{"checked": len(sites)})
}

// SiteStatus is the result of a site's most recent check.
type SiteStatus struct {
	ID        int64     `json:"id"`
	Up        bool      `json:"up"`
	CheckedAt time.Time `json:"checked_at"`
}

func status(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query(r.Context(), `
		SELECT DISTINCT ON (site_id) site_id, up, checked_at
		FROM checks
		ORDER BY site_id, checked_at DESC
	`)
	if err != nil {
		internalError(w, r, err)
		return
	}
	defer rows.Close()

	sites := []SiteStatus{}
	for rows.Next() {
		var s SiteStatus
		if err := rows.Scan(&s.ID, &s.Up, &s.CheckedAt); err != nil {
			internalError(w, r, err)
			return
		}
		sites = append(sites, s)
	}
	if err := rows.Err(); err != nil {
		internalError(w, r, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"sites": sites})
}

func pingURL(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]bool{"up": ping(r.Context(), r.PathValue("url"))})
}
