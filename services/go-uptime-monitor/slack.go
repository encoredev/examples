package main

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"net/url"

	"sdk.encore.dev/pubsub"
	"sdk.encore.dev/secrets"
)

// slackWebhookURL is the Slack incoming webhook to post notifications to
// (https://api.slack.com/messaging/webhooks). While it is not set,
// notifications are logged and skipped.
var slackWebhookURL = secrets.New[string]("SlackWebhookURL")

// Each transition is posted to Slack.
var _ = pubsub.NewSubscription(transitions, "slack-notification", pubsub.SubscriptionConfig[*TransitionEvent]{
	Handler: notifySlack,
})

func notifySlack(ctx context.Context, msg pubsub.Message[*TransitionEvent]) error {
	event := msg.Data
	text := fmt.Sprintf("*%s is down!*", event.Site.URL)
	if event.Up {
		text = fmt.Sprintf("*%s is back up.*", event.Site.URL)
	}

	webhook := slackWebhookURL.StringValue()
	if webhook == "" {
		slog.InfoContext(ctx, "SlackWebhookURL is not set, skipping the Slack notification", "text", text)
		return nil
	}

	body, err := json.Marshal(map[string]string{"text": text})
	if err != nil {
		return err
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, webhook, bytes.NewReader(body))
	if err != nil {
		// Not err itself: it would quote the secret.
		return errors.New("notify slack: SlackWebhookURL is not a valid URL")
	}
	req.Header.Set("Content-Type", "application/json")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		// The error would quote the webhook URL, which is a secret.
		var urlErr *url.Error
		if errors.As(err, &urlErr) {
			err = urlErr.Err
		}
		return fmt.Errorf("notify slack: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 400 {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("notify slack: %s: %s", resp.Status, body)
	}
	slog.InfoContext(ctx, "notified slack", "text", text)
	return nil
}
