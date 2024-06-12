package client

import (
	"context"
	"image"

	"encore.app/llm/provider"
)

// Client is the interface that all LLM clients must implement.
type Client interface {
	// ContinueChat continues a chat session with the given request.
	ContinueChat(ctx context.Context, req *provider.ChatRequest) (*provider.ContinueChatResponse, error)
	// CancelTask cancels a task with the given ID.
	CancelTask(ctx context.Context, taskID string) error
	// Ask asks a question to the llm.
	Ask(ctx context.Context, msg string) (string, error)
	// GenerateAvatar generates an avatar image based on the given prompt.
	GenerateAvatar(ctx context.Context, prompt string) (image.Image, error)
}
