package gemini

import (
	"context"
	"image"

	"github.com/cockroachdb/errors"

	"encore.app/llm/provider"
	"encore.app/llm/provider/gemini"
	"encore.app/llm/service/client"
)

func NewClient(ctx context.Context) (*Client, bool) {
	if gemini.Ping(ctx) != nil {
		return nil, false
	}
	return &Client{}, true
}

// Client wraps the gemini service endpoints to implement the llm client interface.
type Client struct{}

func (p *Client) CancelTask(ctx context.Context, taskID string) error {
	return nil
}

func (p *Client) ContinueChat(ctx context.Context, req *provider.ChatRequest) (*provider.ContinueChatResponse, error) {
	return gemini.ContinueChat(ctx, req)
}

func (p *Client) Ask(ctx context.Context, msg string) (string, error) {
	resp, err := gemini.Ask(ctx, &gemini.AskRequest{
		Message: msg,
	})
	if err != nil {
		return "", errors.Wrap(err, "ask")
	}
	return resp.Message, nil
}

func (p *Client) GenerateAvatar(ctx context.Context, prompt string) (image.Image, error) {
	// Imagen is not yet available
	return nil, nil
}

var _ client.Client = (*Client)(nil)
