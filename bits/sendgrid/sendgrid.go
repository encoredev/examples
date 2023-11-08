package sendgrid

import (
	"context"
	"net/http"

	"encore.dev"
	"encore.dev/beta/errs"
	"encore.dev/pubsub"
	"encore.dev/rlog"
	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

// Encore docs about secrets: https://encore.dev/docs/primitives/secrets
var secrets struct {
	SendGridAPIKey string
}

type SendParams struct {
	From struct {
		Name  string `json:"name,omitempty"`
		Email string `json:"email"`
	} `json:"from"`
	To struct {
		Name  string `json:"name,omitempty"`
		Email string `json:"email"`
	} `json:"to"`
	Subject string `json:"subject"`
	Text    string `json:"text"`
	Html    string `json:"html"`
}

type SendResponse struct {
	MessageID string `json:"message_id"`
}

// Send sends an email using the SendGrid API.
// https://docs.sendgrid.com/api-reference/mail-send/mail-send
//
//encore:api private method=POST path=/sendgrid
func Send(ctx context.Context, params *SendParams) (*SendResponse, error) {
	// Preparing the data to create an email event ready to be sent
	event := &EmailPreparedEvent{
		From:             *mail.NewEmail(params.From.Name, params.From.Email),
		To:               *mail.NewEmail(params.To.Name, params.To.Email),
		Subject:          params.Subject,
		PlainTextContent: params.Text,
		HTMLContent:      params.Html,
	}

	// Publishing an event
	messageID, err := Emails.Publish(ctx, event)
	if err != nil {
		return nil, err
	}

	return &SendResponse{MessageID: messageID}, nil
}

type EmailPreparedEvent struct {
	From             mail.Email
	Subject          string
	To               mail.Email
	PlainTextContent string
	HTMLContent      string
}

var Emails = pubsub.NewTopic[*EmailPreparedEvent]("emails", pubsub.TopicConfig{
	DeliveryGuarantee: pubsub.AtLeastOnce,
})

// The maximum number of messages which will be processed and retry policy can be configured below.
// https://pkg.go.dev/encore.dev/pubsub#SubscriptionConfig
var _ = pubsub.NewSubscription(
	Emails, "send-email",
	pubsub.SubscriptionConfig[*EmailPreparedEvent]{
		Handler: sendEmail,
	},
)

// To sending email, PubSub is used to control concurrency and avoid DDoS Sendgrid API.
// https://encore.dev/docs/primitives/pubsub
func sendEmail(ctx context.Context, event *EmailPreparedEvent) error {
	// Creating an email
	message := mail.NewSingleEmail(&event.From, event.Subject, &event.To, event.PlainTextContent, event.HTMLContent)
	// Skipping sending an email in a non-production environment
	if encore.Meta().Environment.Type != encore.EnvProduction {
		rlog.Info(
			"email sending was skipped in a non-production environment.",
			"env:", encore.Meta().Environment.Type,
			"message:", message)
		return nil
	}

	// Creating a client using an API key
	client := sendgrid.NewSendClient(secrets.SendGridAPIKey)
	// Sending and error handling
	response, err := client.SendWithContext(ctx, message)
	if err != nil {
		rlog.Error(err.Error())
		return err
	}

	if response.StatusCode != http.StatusOK {
		return &errs.Error{
			Code:    errs.Internal,
			Message: "failed to send email",
		}
	}
	return nil
}
