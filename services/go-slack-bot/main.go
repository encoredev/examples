// A Slack bot that brings cowsay to Slack: the /cowsay slash command answers
// with ASCII cow art saying the command's text.
//
//	GET  /{{name}}         usage instructions
//	POST /{{name}}/cowsay  the slash command's request URL, called by Slack
//
// Every slash command request is checked against the Slack app's signing
// secret, kept in the SlackSigningSecret secret, before it is answered.
package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"log/slog"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"

	"sdk.encore.dev/env"
	"sdk.encore.dev/secrets"
	"sdk.encore.dev/shutdown"
)

const service = "{{name}}"

// signingSecret is the Slack app's Signing Secret, from its Basic
// Information page. Slack signs every request with it.
var signingSecret = secrets.New[string]("SlackSigningSecret")

// cowart is the formatting string for printing the cow art.
const cowart = `
 ________________________________________
< %- 38s >
 ----------------------------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
`

// maxBodySize bounds the slash command's body; Slack's are a few hundred bytes.
const maxBodySize = 64 << 10

// maxClockSkew is how far a request's timestamp may be from now, so that a
// request captured on the way can't be replayed later.
const maxClockSkew = 5 * time.Minute

func main() {
	slog.SetDefault(slog.New(env.NewLogHandler(&env.LogHandlerOptions{Name: service})))

	mux := http.NewServeMux()
	mux.HandleFunc("GET /"+service, index)
	mux.HandleFunc("GET /"+service+"/{$}", index)
	mux.HandleFunc("POST /"+service+"/cowsay", cowsay)

	addr := listenAddr()
	srv := &http.Server{Addr: addr, Handler: mux}
	shutdown.OnShutdown(srv.Shutdown)
	slog.Info("listening", "service", service, "addr", addr)
	if err := srv.ListenAndServe(); !errors.Is(err, http.ErrServerClosed) {
		log.Fatal(err)
	}
	// Encore exits once the shutdown completes.
	select {}
}

// index describes how to use the bot.
func index(w http.ResponseWriter, _ *http.Request) {
	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	fmt.Fprintf(w, `Slack bot: cowsay for Slack.

Point a Slack slash command's Request URL at POST /%s/cowsay, then type
"/cowsay Hello!" in Slack. Requests are verified with the Slack app's
signing secret (the SlackSigningSecret secret).
`, service)
}

// cowsay handles the slash command: it verifies the request came from Slack
// and answers in the channel with the cow saying the command's text.
func cowsay(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(http.MaxBytesReader(w, r.Body, maxBodySize))
	if err != nil {
		http.Error(w, "could not read the request body", http.StatusBadRequest)
		return
	}

	secret, err := signingSecret.Value()
	if err != nil || secret == "" {
		slog.ErrorContext(r.Context(), "SlackSigningSecret is not set, so no request can be verified")
		http.Error(w, "the bot is not configured", http.StatusInternalServerError)
		return
	}
	if err := verify(r.Header, body, secret, time.Now()); err != nil {
		slog.WarnContext(r.Context(), "rejected a slash command", "reason", err.Error())
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	form, err := url.ParseQuery(string(body))
	if err != nil {
		http.Error(w, "the body must be a form", http.StatusBadRequest)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(map[string]string{
		"response_type": "in_channel",
		"text":          fmt.Sprintf(cowart, form.Get("text")),
	}); err != nil {
		slog.ErrorContext(r.Context(), "writing the response", "err", err)
	}
}

// verify checks a request is from Slack, as
// https://api.slack.com/authentication/verifying-requests-from-slack
// describes: its X-Slack-Signature is "v0=" and the hex HMAC-SHA256, keyed
// with the signing secret, of "v0:{X-Slack-Request-Timestamp}:{body}".
func verify(h http.Header, body []byte, secret string, now time.Time) error {
	ts := h.Get("X-Slack-Request-Timestamp")
	sec, err := strconv.ParseInt(ts, 10, 64)
	if err != nil {
		return errors.New("missing or malformed X-Slack-Request-Timestamp")
	}
	if skew := now.Sub(time.Unix(sec, 0)); skew > maxClockSkew || skew < -maxClockSkew {
		return errors.New("the request is not recent")
	}

	sig, ok := strings.CutPrefix(h.Get("X-Slack-Signature"), "v0=")
	if !ok {
		return errors.New("missing or unknown X-Slack-Signature")
	}
	got, err := hex.DecodeString(sig)
	if err != nil {
		return errors.New("malformed X-Slack-Signature")
	}
	mac := hmac.New(sha256.New, []byte(secret))
	fmt.Fprintf(mac, "v0:%s:", ts)
	mac.Write(body)
	if !hmac.Equal(got, mac.Sum(nil)) {
		return errors.New("signature mismatch")
	}
	return nil
}

// listenAddr is where to serve. Encore's local run supplies
// ENCORE_LISTEN_ADDR; run on its own, this falls back to PORT and then to 8080.
func listenAddr() string {
	if addr := os.Getenv("ENCORE_LISTEN_ADDR"); addr != "" {
		return addr
	}
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	return ":" + port
}
