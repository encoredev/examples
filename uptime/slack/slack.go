// Service slack posts notifications to a Slack Webhook.
package slack

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"encore.app/monitor"

	"encore.dev/pubsub"
	"encore.dev/rlog"
)

// This is a service struct, learn more: https://encore.dev/docs/go/primitives/service-structs
//
//encore:service
type Service struct {
	// webhookURL is the Slack Webhook URL to post notifications to.
	// It's a struct field to facilitate testing.
	webhookURL string
}

// initService is automatically called by Encore when the service starts up.
func initService() (*Service, error) {
	svc := &Service{
		webhookURL: secrets.SlackWebhookURL,
	}
	return svc, nil
}

type NotifyParams struct {
	// Text is the Slack message text to send.
	Text string `json:"text"`
}

// Notify is a private endpoint that sends a Slack message to a pre-configured channel.
// Learn more about Encore's API access controls: https://encore.dev/docs/go/primitives/defining-apis#access-controls
//
//encore:api private
func (s *Service) Notify(ctx context.Context, p *NotifyParams) error {
	// If the secret isn't set for local development, log a message
	// and do nothing.
	if s.webhookURL == "" {
		rlog.Debug("no slack webhook url defined, skipping slack notification")
		return nil
	}

	reqBody, err := json.Marshal(p)
	if err != nil {
		return err
	}
	req, err := http.NewRequestWithContext(ctx, "POST", s.webhookURL, bytes.NewReader(reqBody))
	if err != nil {
		return err
	}
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("notify slack: %s: %s", resp.Status, body)
	}
	return nil
}

// This uses Encore's built-in secrets manager, learn more: https://encore.dev/docs/go/primitives/secrets
var secrets struct {
	SlackWebhookURL string
}

// This uses a Pub/Sub subscription, learn more: https://encore.dev/docs/go/primitives/pubsub
var _ = pubsub.NewSubscription(monitor.TransitionTopic, "slack-notification", pubsub.SubscriptionConfig[*monitor.TransitionEvent]{
	Handler: func(ctx context.Context, event *monitor.TransitionEvent) error {
		msg := fmt.Sprintf("*%s is down!*", event.Site.URL)
		if event.Up {
			msg = fmt.Sprintf("*%s is back up.*", event.Site.URL)
		}
		return Notify(ctx, &NotifyParams{
			Text: msg,
		})
	},
})
