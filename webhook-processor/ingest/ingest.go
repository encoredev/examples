// Service ingest receives and validates incoming webhooks.
package ingest

import (
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"time"
)

var secrets struct {
	WebhookSecretStripe string
	WebhookSecretGitHub string
}

// ReceiveRequest is the request to receive a webhook.
type ReceiveRequest struct {
	// The event type (e.g. "payment_intent.succeeded" for Stripe, "push" for GitHub).
	EventType *string `json:"event_type,omitempty"`
	// The webhook payload as a JSON string.
	Body string `json:"body"`
	// The signature to validate.
	Signature *string `json:"signature,omitempty"`
}

// ReceiveResponse is the response from receiving a webhook.
type ReceiveResponse struct {
	Status string `json:"status"`
}

// Receive receives and queues a webhook for async processing.
// Validates the signature if a secret is configured for the source.
//
//encore:api public method=POST path=/webhooks/:source
func Receive(ctx context.Context, source string, req *ReceiveRequest) (*ReceiveResponse, error) {
	// Validate signature if secret is configured for this source.
	webhookSecret := getSecretForSource(source)
	if webhookSecret != "" && req.Signature != nil {
		mac := hmac.New(sha256.New, []byte(webhookSecret))
		mac.Write([]byte(req.Body))
		expected := hex.EncodeToString(mac.Sum(nil))

		if *req.Signature != expected {
			return &ReceiveResponse{Status: "invalid signature"}, nil
		}
	}

	// Parse body to store as structured data.
	var parsed map[string]any
	var payloadRaw json.RawMessage
	if err := json.Unmarshal([]byte(req.Body), &parsed); err != nil {
		raw, _ := json.Marshal(map[string]string{"raw": req.Body})
		payloadRaw = raw
	} else {
		payloadRaw = []byte(req.Body)
	}

	// Use provided event_type, or try to extract from payload.
	eventType := extractEventType(source, parsed)
	if req.EventType != nil && *req.EventType != "" {
		eventType = *req.EventType
	}

	if _, err := WebhookTopic.Publish(ctx, &WebhookEvent{
		Source:     source,
		EventType:  eventType,
		Payload:    payloadRaw,
		ReceivedAt: time.Now().UTC().Format(time.RFC3339),
	}); err != nil {
		return nil, err
	}

	return &ReceiveResponse{Status: "accepted"}, nil
}

func getSecretForSource(source string) string {
	switch source {
	case "stripe":
		return secrets.WebhookSecretStripe
	case "github":
		return secrets.WebhookSecretGitHub
	default:
		return ""
	}
}

func extractEventType(source string, payload map[string]any) string {
	if source == "stripe" {
		if t, ok := payload["type"].(string); ok {
			return t
		}
	}
	if source == "github" {
		if a, ok := payload["action"].(string); ok {
			return a
		}
	}
	if e, ok := payload["event"].(string); ok {
		return e
	}
	return "unknown"
}
