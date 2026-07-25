package email

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"encore.dev/config"
)

var secrets struct {
	MailtrapAPIToken string
}

type SendParams struct {
	To      string `json:"to"`
	Subject string `json:"subject"`
	Body    string `json:"body"`
}

type SendResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

// Send sends a transactional email via Mailtrap Email API.
//
//encore:api public method=POST path=/email/send
func Send(ctx context.Context, p *SendParams) (*SendResponse, error) {
	payload := map[string]interface{}{
		"from": map[string]string{
			"email": "hello@yourdomain.com",
			"name":  "My App",
		},
		"to": []map[string]string{
			{"email": p.To},
		},
		"subject": p.Subject,
		"text":    p.Body,
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal payload: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost,
		"https://send.api.mailtrap.io/api/send",
		bytes.NewReader(body))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+secrets.MailtrapAPIToken)
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to send email: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("mailtrap API error: status %d", resp.StatusCode)
	}

	return &SendResponse{
		Success: true,
		Message: "Email sent successfully",
	}, nil
}
