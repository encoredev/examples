// Service notifications filters and stores important webhook events.
package notifications

import (
	"context"
	"encoding/json"
	"time"

	"encore.app/ingest"
	"encore.dev/pubsub"
	"encore.dev/rlog"
	"encore.dev/storage/sqldb"
)

var db = sqldb.NewDatabase("notifications", sqldb.DatabaseConfig{
	Migrations: "./migrations",
})

// Important event types that should trigger notifications.
var importantEvents = map[string]bool{
	"payment_intent.succeeded":        true,
	"payment_intent.payment_failed":   true,
	"customer.subscription.deleted":   true,
	"invoice.payment_failed":          true,
	"push":                            true,
	"pull_request":                    true,
	"release":                         true,
}

// Second subscriber on the same topic — demonstrates fan-out pattern.
// Both the processor and notifications services receive every event independently.
var _ = pubsub.NewSubscription(ingest.WebhookTopic, "notify-important", pubsub.SubscriptionConfig[*ingest.WebhookEvent]{
	Handler: func(ctx context.Context, event *ingest.WebhookEvent) error {
		if !importantEvents[event.EventType] {
			return nil
		}

		rlog.Info("important webhook event", "source", event.Source, "type", event.EventType)

		_, err := db.Exec(ctx, `
			INSERT INTO notifications (source, event_type, payload)
			VALUES ($1, $2, $3)
		`, event.Source, event.EventType, []byte(event.Payload))
		return err
	},
})

// Notification represents an important event notification.
type Notification struct {
	ID        int64          `json:"id"`
	Source    string         `json:"source"`
	EventType string         `json:"event_type"`
	Payload   json.RawMessage `json:"payload"`
	CreatedAt string         `json:"created_at"`
}

// ListResponse is the response for listing notifications.
type ListResponse struct {
	Notifications []Notification `json:"notifications"`
}

// List lists recent important notifications.
//
//encore:api public method=GET path=/notifications
func List(ctx context.Context) (*ListResponse, error) {
	rows, err := db.Query(ctx, `
		SELECT id, source, event_type, payload, created_at
		FROM notifications
		ORDER BY created_at DESC
		LIMIT 50
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var notifications []Notification
	for rows.Next() {
		var n Notification
		var t time.Time
		if err := rows.Scan(&n.ID, &n.Source, &n.EventType, &n.Payload, &t); err != nil {
			return nil, err
		}
		n.CreatedAt = t.Format(time.RFC3339)
		notifications = append(notifications, n)
	}

	return &ListResponse{Notifications: notifications}, nil
}

// StatEntry represents a notification count for an event type.
type StatEntry struct {
	EventType string `json:"event_type"`
	Count     int    `json:"count"`
}

// StatsResponse is the response for notification stats.
type StatsResponse struct {
	Stats []StatEntry `json:"stats"`
}

// Stats gets notification counts grouped by event type.
//
//encore:api public method=GET path=/notifications/stats
func Stats(ctx context.Context) (*StatsResponse, error) {
	rows, err := db.Query(ctx, `
		SELECT event_type, COUNT(*)::int AS count
		FROM notifications
		GROUP BY event_type
		ORDER BY count DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var stats []StatEntry
	for rows.Next() {
		var s StatEntry
		if err := rows.Scan(&s.EventType, &s.Count); err != nil {
			return nil, err
		}
		stats = append(stats, s)
	}

	return &StatsResponse{Stats: stats}, nil
}
