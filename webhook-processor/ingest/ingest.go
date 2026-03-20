// Service ingest receives and validates incoming webhooks.
package ingest

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"io"
	"net/http"
	"strings"
	"time"
)

var secrets struct {
	WebhookSecretStripe string
	WebhookSecretGitHub string
}

// Receive receives incoming webhooks and queues them for async processing.
// Uses a raw endpoint to access the full HTTP request for signature validation.
//
//encore:api public raw path=/webhooks/:source
func Receive(w http.ResponseWriter, req *http.Request) {
	source := strings.TrimPrefix(req.URL.Path, "/webhooks/")

	// Read the raw request body.
	body, err := io.ReadAll(req.Body)
	if err != nil {
		http.Error(w, `{"status":"bad request"}`, http.StatusBadRequest)
		return
	}
	defer req.Body.Close()

	// Validate signature if a secret is configured for this source.
	webhookSecret := getSecretForSource(source)
	if webhookSecret != "" {
		signature := req.Header.Get("X-Signature-256")
		if signature == "" {
			signature = req.Header.Get("Stripe-Signature")
		}
		if signature != "" {
			mac := hmac.New(sha256.New, []byte(webhookSecret))
			mac.Write(body)
			expected := hex.EncodeToString(mac.Sum(nil))

			if !hmac.Equal([]byte(signature), []byte(expected)) {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusUnauthorized)
				w.Write([]byte(`{"status":"invalid signature"}`))
				return
			}
		}
	}

	// Parse body to store as structured data.
	var parsed map[string]any
	var payloadRaw json.RawMessage
	if err := json.Unmarshal(body, &parsed); err != nil {
		raw, _ := json.Marshal(map[string]string{"raw": string(body)})
		payloadRaw = raw
	} else {
		payloadRaw = body
	}

	// Extract event type from payload or headers.
	eventType := extractEventType(source, req.Header, parsed)

	if _, err := WebhookTopic.Publish(req.Context(), &WebhookEvent{
		Source:     source,
		EventType:  eventType,
		Payload:    payloadRaw,
		ReceivedAt: time.Now().UTC().Format(time.RFC3339),
	}); err != nil {
		http.Error(w, `{"status":"internal error"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status":"accepted"}`))
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

func extractEventType(source string, headers http.Header, payload map[string]any) string {
	// GitHub sends the event type in a header.
	if source == "github" {
		if gh := headers.Get("X-GitHub-Event"); gh != "" {
			return gh
		}
	}

	// Stripe includes the type in the payload.
	if source == "stripe" {
		if t, ok := payload["type"].(string); ok {
			return t
		}
	}

	// Generic fallback: look for common field names.
	if e, ok := payload["event"].(string); ok {
		return e
	}
	if t, ok := payload["event_type"].(string); ok {
		return t
	}
	return "unknown"
}
