package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"io"
	"log/slog"
	"net/http"
	"strconv"
	"strings"
	"time"

	"sdk.encore.dev/secrets"
)

// The signing secrets of the senders whose signatures are checked. A source
// whose secret is not set has its webhooks accepted without a check.
var (
	stripeSecret = secrets.New[string]("WebhookSecretStripe")
	githubSecret = secrets.New[string]("WebhookSecretGitHub")
)

// maxBodySize is the largest webhook body accepted.
const maxBodySize = 1 << 20

// stripeTolerance is how old a Stripe signature may be, as in Stripe's SDKs:
// an older one may be a replay.
const stripeTolerance = 5 * time.Minute

// receive accepts a webhook from source, checks its signature if the
// source's secret is set, and publishes it to be processed.
func receive(w http.ResponseWriter, r *http.Request) {
	source := r.PathValue("source")
	body, err := io.ReadAll(http.MaxBytesReader(w, r.Body, maxBodySize))
	if err != nil {
		var tooLarge *http.MaxBytesError
		if errors.As(err, &tooLarge) {
			writeError(w, http.StatusRequestEntityTooLarge, "the body is too large")
			return
		}
		writeError(w, http.StatusBadRequest, "cannot read the body")
		return
	}

	if !verify(source, r.Header, body) {
		writeError(w, http.StatusUnauthorized, "invalid signature")
		return
	}

	// Store a body that is not a JSON object as {"raw": "..."}.
	var parsed map[string]any
	payload := json.RawMessage(body)
	if err := json.Unmarshal(body, &parsed); err != nil {
		payload, _ = json.Marshal(map[string]string{"raw": string(body)})
	}

	event := &WebhookEvent{
		Source:     source,
		EventType:  eventType(source, r.Header, parsed),
		Payload:    payload,
		ReceivedAt: time.Now().UTC(),
	}
	if _, err := webhooks.Publish(r.Context(), event); err != nil {
		slog.ErrorContext(r.Context(), "publishing webhook", "source", source, "err", err)
		writeError(w, http.StatusInternalServerError, "cannot queue the webhook")
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "accepted"})
}

// verify reports whether a webhook's signature is valid, or needs no check:
// for a source other than stripe and github, or one whose secret is not set.
func verify(source string, header http.Header, body []byte) bool {
	switch source {
	case "stripe":
		secret := stripeSecret.StringValue()
		return secret == "" || verifyStripe(header.Get("Stripe-Signature"), body, secret, time.Now())
	case "github":
		secret := githubSecret.StringValue()
		return secret == "" || verifyGitHub(header.Get("X-Hub-Signature-256"), body, secret)
	default:
		return true
	}
}

// verifyGitHub checks an X-Hub-Signature-256 header, "sha256=<hex>": the
// HMAC-SHA256 of the body.
func verifyGitHub(signature string, body []byte, secret string) bool {
	sig, ok := strings.CutPrefix(signature, "sha256=")
	if !ok {
		return false
	}
	return hmacEqual(sig, secret, body)
}

// verifyStripe checks a Stripe-Signature header, "t=<unix time>,v1=<hex>":
// the HMAC-SHA256 of "<t>.<body>", with any number of v1 signatures (several
// while a secret is being rolled). The timestamp must be recent.
func verifyStripe(header string, body []byte, secret string, now time.Time) bool {
	var ts string
	var sigs []string
	for part := range strings.SplitSeq(header, ",") {
		key, value, _ := strings.Cut(part, "=")
		switch key {
		case "t":
			ts = value
		case "v1":
			sigs = append(sigs, value)
		}
	}
	unix, err := strconv.ParseInt(ts, 10, 64)
	if err != nil {
		return false
	}
	if age := now.Sub(time.Unix(unix, 0)); age > stripeTolerance || age < -stripeTolerance {
		return false
	}
	signed := append([]byte(ts+"."), body...)
	for _, sig := range sigs {
		if hmacEqual(sig, secret, signed) {
			return true
		}
	}
	return false
}

// hmacEqual reports whether hexSig is the HMAC-SHA256 of msg under secret,
// in constant time.
func hmacEqual(hexSig, secret string, msg []byte) bool {
	sig, err := hex.DecodeString(hexSig)
	if err != nil {
		return false
	}
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write(msg)
	return hmac.Equal(sig, mac.Sum(nil))
}

// eventType is a webhook's event type: GitHub sends it in a header, Stripe
// in the payload's "type", and other senders often in "event" or
// "event_type".
func eventType(source string, header http.Header, payload map[string]any) string {
	if source == "github" {
		if t := header.Get("X-GitHub-Event"); t != "" {
			return t
		}
	}
	if source == "stripe" {
		if t, ok := payload["type"].(string); ok {
			return t
		}
	}
	for _, key := range []string{"event", "event_type"} {
		if t, ok := payload[key].(string); ok {
			return t
		}
	}
	return "unknown"
}
