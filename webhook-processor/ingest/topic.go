package ingest

import (
	"encoding/json"

	"encore.dev/pubsub"
)

// WebhookEvent represents an incoming webhook event.
type WebhookEvent struct {
	Source     string          `json:"source"`
	EventType string          `json:"event_type"`
	Payload   json.RawMessage `json:"payload"`
	ReceivedAt string         `json:"received_at"`
}

// WebhookTopic is the Pub/Sub topic for incoming webhook events.
// Multiple services can subscribe to process events independently (fan-out pattern).
var WebhookTopic = pubsub.NewTopic[*WebhookEvent]("webhook-received", pubsub.TopicConfig{
	DeliveryGuarantee: pubsub.AtLeastOnce,
})
