package monitor

import (
	"context"
	"time"
)

// SiteStatus describes the current status of a site
// and when it was last checked.
type SiteStatus struct {
	Up        bool      `json:"up"`
	CheckedAt time.Time `json:"checked_at"`
}

// StatusResponse is the response type from the Status endpoint.
type StatusResponse struct {
	// Sites contains the current status of all sites,
	// keyed by the site ID.
	Sites map[int]SiteStatus `json:"sites"`
}

// Status checks the current up/down status of all monitored sites.
//
//encore:api public method=GET path=/status
func Status(ctx context.Context) (*StatusResponse, error) {
	rows, err := db.Query(ctx, `
		SELECT DISTINCT ON (site_id) site_id, up, checked_at
		FROM checks
		ORDER BY site_id, checked_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	result := make(map[int]SiteStatus)
	for rows.Next() {
		var siteID int
		var status SiteStatus
		if err := rows.Scan(&siteID, &status.Up, &status.CheckedAt); err != nil {
			return nil, err
		}
		result[siteID] = status
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return &StatusResponse{Sites: result}, nil
}
