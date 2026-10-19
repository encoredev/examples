package main

import (
	"context"
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"strconv"
	"time"

	"sdk.encore.dev/pubsub"
	"sdk.encore.dev/storage/postgres"
)

// db holds the events and notifications. Encore provisions it and applies
// ./migrations before the service starts.
var db = postgres.NewDatabase("{{ident}}", postgres.DatabaseConfig{
	Migrations: "./migrations",
})

// WebhookEvent is a webhook received, as it is published.
type WebhookEvent struct {
	Source     string          `json:"source"`
	EventType  string          `json:"event_type"`
	Payload    json.RawMessage `json:"payload"`
	ReceivedAt time.Time       `json:"received_at"`
}

// webhooks carries each webhook received. Each of its subscriptions gets
// every message, and handles it independently of the others.
var webhooks = pubsub.NewTopic[*WebhookEvent]("{{kebab}}-webhook-received", pubsub.TopicConfig{})

// Store every event.
var _ = pubsub.NewSubscription(webhooks, "process-events", pubsub.SubscriptionConfig[*WebhookEvent]{
	Handler: func(ctx context.Context, msg pubsub.Message[*WebhookEvent]) error {
		e := msg.Data
		slog.InfoContext(ctx, "processing webhook", "source", e.Source, "type", e.EventType)
		_, err := db.Exec(ctx, `
			INSERT INTO webhook_events (source, event_type, payload, received_at)
			VALUES ($1, $2, $3, $4)
		`, e.Source, e.EventType, []byte(e.Payload), e.ReceivedAt)
		return err
	},
})

// importantEvents are the event types kept as notifications.
var importantEvents = map[string]bool{
	"payment_intent.succeeded":      true,
	"payment_intent.payment_failed": true,
	"customer.subscription.deleted": true,
	"invoice.payment_failed":        true,
	"push":                          true,
	"pull_request":                  true,
	"release":                       true,
}

// Keep the important events as notifications.
var _ = pubsub.NewSubscription(webhooks, "notify-important", pubsub.SubscriptionConfig[*WebhookEvent]{
	Handler: func(ctx context.Context, msg pubsub.Message[*WebhookEvent]) error {
		e := msg.Data
		if !importantEvents[e.EventType] {
			return nil
		}
		slog.InfoContext(ctx, "important webhook event", "source", e.Source, "type", e.EventType)
		_, err := db.Exec(ctx, `
			INSERT INTO notifications (source, event_type, payload)
			VALUES ($1, $2, $3)
		`, e.Source, e.EventType, []byte(e.Payload))
		return err
	},
})

// StoredEvent is a webhook event as it is stored.
type StoredEvent struct {
	ID          int64           `json:"id"`
	Source      string          `json:"source"`
	EventType   string          `json:"event_type"`
	Payload     json.RawMessage `json:"payload"`
	Status      string          `json:"status"`
	ReceivedAt  time.Time       `json:"received_at"`
	ProcessedAt time.Time       `json:"processed_at"`
}

func listEvents(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query(r.Context(), `
		SELECT id, source, event_type, payload, status, received_at, processed_at
		FROM webhook_events
		ORDER BY received_at DESC
		LIMIT 50
	`)
	if err != nil {
		internalError(w, r, err)
		return
	}
	defer rows.Close()

	events := []StoredEvent{}
	for rows.Next() {
		var e StoredEvent
		if err := rows.Scan(&e.ID, &e.Source, &e.EventType, &e.Payload, &e.Status, &e.ReceivedAt, &e.ProcessedAt); err != nil {
			internalError(w, r, err)
			return
		}
		events = append(events, e)
	}
	if err := rows.Err(); err != nil {
		internalError(w, r, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"events": events})
}

func getEvent(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil {
		writeError(w, http.StatusBadRequest, "the event id must be a number")
		return
	}
	var e StoredEvent
	err = db.QueryRow(r.Context(), `
		SELECT id, source, event_type, payload, status, received_at, processed_at
		FROM webhook_events
		WHERE id = $1
	`, id).Scan(&e.ID, &e.Source, &e.EventType, &e.Payload, &e.Status, &e.ReceivedAt, &e.ProcessedAt)
	switch {
	case errors.Is(err, postgres.ErrNoRows):
		writeError(w, http.StatusNotFound, "event not found")
	case err != nil:
		internalError(w, r, err)
	default:
		writeJSON(w, http.StatusOK, e)
	}
}

// Notification is an important event.
type Notification struct {
	ID        int64           `json:"id"`
	Source    string          `json:"source"`
	EventType string          `json:"event_type"`
	Payload   json.RawMessage `json:"payload"`
	CreatedAt time.Time       `json:"created_at"`
}

func listNotifications(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query(r.Context(), `
		SELECT id, source, event_type, payload, created_at
		FROM notifications
		ORDER BY created_at DESC
		LIMIT 50
	`)
	if err != nil {
		internalError(w, r, err)
		return
	}
	defer rows.Close()

	notifications := []Notification{}
	for rows.Next() {
		var n Notification
		if err := rows.Scan(&n.ID, &n.Source, &n.EventType, &n.Payload, &n.CreatedAt); err != nil {
			internalError(w, r, err)
			return
		}
		notifications = append(notifications, n)
	}
	if err := rows.Err(); err != nil {
		internalError(w, r, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"notifications": notifications})
}

// StatEntry is how many notifications there are of an event type.
type StatEntry struct {
	EventType string `json:"event_type"`
	Count     int64  `json:"count"`
}

func notificationStats(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query(r.Context(), `
		SELECT event_type, COUNT(*) AS count
		FROM notifications
		GROUP BY event_type
		ORDER BY count DESC
	`)
	if err != nil {
		internalError(w, r, err)
		return
	}
	defer rows.Close()

	stats := []StatEntry{}
	for rows.Next() {
		var s StatEntry
		if err := rows.Scan(&s.EventType, &s.Count); err != nil {
			internalError(w, r, err)
			return
		}
		stats = append(stats, s)
	}
	if err := rows.Err(); err != nil {
		internalError(w, r, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"stats": stats})
}

func internalError(w http.ResponseWriter, r *http.Request, err error) {
	slog.ErrorContext(r.Context(), "query failed", "err", err)
	writeError(w, http.StatusInternalServerError, "internal error")
}
