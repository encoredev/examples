package agent

import (
	"context"
	"os"

	"google.golang.org/adk/v2/model"
	"google.golang.org/adk/v2/model/gemini"
	"google.golang.org/genai"
)

var secrets struct {
	GoogleAPIKey string // Gemini API key. Set with: encore secret set --type dev,preview,local GoogleAPIKey
}

// newModel returns Gemini when a key is configured, otherwise a local mock.
func newModel(ctx context.Context) (model.LLM, string, error) {
	key := secrets.GoogleAPIKey
	if key == "" {
		key = os.Getenv("GOOGLE_API_KEY")
	}
	if key == "" {
		return mockLLM{}, "mock", nil
	}
	name := os.Getenv("GEMINI_MODEL")
	if name == "" {
		name = "gemini-flash-latest"
	}
	cfg := &genai.ClientConfig{APIKey: key, Backend: genai.BackendGeminiAPI}
	if base := os.Getenv("GEMINI_BASE_URL"); base != "" {
		cfg.HTTPOptions.BaseURL = base // e.g. a local stub server
	}
	m, err := gemini.NewModel(ctx, name, cfg)
	return m, "gemini", err
}
