// Service processor stores and indexes all webhook events.
package processor

import (
	"context"
	"encoding/json"
	"time"

	"encore.app/ingest"
	"encore.dev/beta/errs"
	"encore.dev/pubsub"
	"encore.dev/rlog"
	"encore.dev/storage/sqldb"
)

var db = sqldb.NewDatabase("processor", sqldb.DatabaseConfig{
	Migrations: "./migrations",
})

// Subscribe to the webhook topic and store processed events.
var _ = pubsub.NewSubscription(ingest.WebhookTopic, "process-events", pubsub.SubscriptionConfig[*ingest.WebhookEvent]{
	Handler: func(ctx context.Context, event *ingest.WebhookEvent) error {
		rlog.Info("processing webhook", "source", event.Source, "type", event.EventType)

		_, err := db.Exec(ctx, `
			INSERT INTO webhook_events (source, event_type, payload, received_at)
			VALUES ($1, $2, $3, $4)
		`, event.Source, event.EventType, []byte(event.Payload), event.ReceivedAt)
		return err
	},
})

// StoredEvent represents a stored webhook event.
type StoredEvent struct {
	ID          int64          `json:"id"`
	Source      string         `json:"source"`
	EventType   string         `json:"event_type"`
	Payload     json.RawMessage `json:"payload"`
	Status      string         `json:"status"`
	ReceivedAt  string         `json:"received_at"`
	ProcessedAt string         `json:"processed_at"`
}

// ListResponse is the response for listing events.
type ListResponse struct {
	Events []StoredEvent `json:"events"`
}

// List lists the 50 most recent processed webhook events.
//
//encore:api public method=GET path=/webhooks/events
func List(ctx context.Context) (*ListResponse, error) {
	rows, err := db.Query(ctx, `
		SELECT id, source, event_type, payload, status, received_at, processed_at
		FROM webhook_events
		ORDER BY received_at DESC
		LIMIT 50
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []StoredEvent
	for rows.Next() {
		var e StoredEvent
		var receivedAt, processedAt time.Time
		if err := rows.Scan(&e.ID, &e.Source, &e.EventType, &e.Payload, &e.Status, &receivedAt, &processedAt); err != nil {
			return nil, err
		}
		e.ReceivedAt = receivedAt.Format(time.RFC3339)
		e.ProcessedAt = processedAt.Format(time.RFC3339)
		events = append(events, e)
	}

	return &ListResponse{Events: events}, nil
}

// Get gets a specific processed webhook event by ID.
//
//encore:api public method=GET path=/webhooks/events/:id
func Get(ctx context.Context, id int64) (*StoredEvent, error) {
	var e StoredEvent
	var receivedAt, processedAt time.Time
	err := db.QueryRow(ctx, `
		SELECT id, source, event_type, payload, status, received_at, processed_at
		FROM webhook_events
		WHERE id = $1
	`, id).Scan(&e.ID, &e.Source, &e.EventType, &e.Payload, &e.Status, &receivedAt, &processedAt)
	if err != nil {
		return nil, &errs.Error{Code: errs.NotFound, Message: "event not found"}
	}
	e.ReceivedAt = receivedAt.Format(time.RFC3339)
	e.ProcessedAt = processedAt.Format(time.RFC3339)
	return &e, nil
}
