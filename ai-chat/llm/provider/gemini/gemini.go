// Gemini is an llm provider implementation for the Google Gemini API.
package gemini

import (
	"context"
	"encoding/json"
	"strings"

	"cloud.google.com/go/vertexai/genai"
	"github.com/cockroachdb/errors"
	"google.golang.org/api/option"

	"encore.app/llm/provider"
	"encore.app/pkg/fns"
	"encore.dev/config"
	"encore.dev/pubsub"
	"encore.dev/rlog"
)

var TopicRef = pubsub.TopicRef[pubsub.Publisher[*provider.BotResponse]](provider.LLMMessageTopic)

type Config struct {
	Model       config.String
	Region      config.String
	Temperature config.Float32
	TopK        config.Int32
}

// This uses Encore Configuration, learn more: https://encore.dev/docs/develop/config
var cfg = config.Load[*Config]()

// This uses Encore's built-in secrets manager, learn more: https://encore.dev/docs/primitives/secrets
var secrets struct {
	GeminiJSONCredentials string
}

// This declares a Encore Service, learn more: https://encore.dev/docs/primitives/services-and-apis/service-structs
//
//encore:service
type Service struct {
	client *genai.GenerativeModel
}

// Ping returns an error if the service is not available.
// encore:api private
func (p *Service) Ping(ctx context.Context) error {
	if p == nil {
		return errors.New("Gemini service is not available. Add GeminiJSONCredentials secret and configure Project to enable it.")
	}
	return nil
}

// initService initializes the Gemini service by creating a client and configuring the model.
func initService() (*Service, error) {
	if secrets.GeminiJSONCredentials == "" {
		return nil, nil
	}
	var projConf struct {
		ProjectID string `json:"project_id"`
	}
	err := json.Unmarshal([]byte(secrets.GeminiJSONCredentials), &projConf)
	if err != nil {
		return nil, errors.Wrap(err, "parse gemini credentials")
	}
	rlog.Info("Initializing Gemini service", "project_id", projConf.ProjectID, "model", cfg.Model(), "region", cfg.Region())
	ctx := context.Background()
	client, err := genai.NewClient(ctx, projConf.ProjectID, cfg.Region(), option.WithCredentialsJSON([]byte(secrets.GeminiJSONCredentials)))
	if err != nil {
		return nil, errors.Wrap(err, "create client")
	}
	model := client.GenerativeModel(cfg.Model())
	model.SafetySettings = []*genai.SafetySetting{
		{
			Category:  genai.HarmCategoryHateSpeech,
			Threshold: genai.HarmBlockNone,
		},
		{
			Category:  genai.HarmCategoryHarassment,
			Threshold: genai.HarmBlockNone,
		},
		{
			Category:  genai.HarmCategoryDangerousContent,
			Threshold: genai.HarmBlockNone,
		},
		{
			Category:  genai.HarmCategorySexuallyExplicit,
			Threshold: genai.HarmBlockNone,
		},
	}
	model.SetTemperature(cfg.Temperature())
	model.CandidateCount = fns.Ptr[int32](1)
	model.SetTopK(cfg.TopK())
	svc := &Service{
		client: model,
	}
	return svc, nil
}

type AskRequest struct {
	Message string
}

type AskResponse struct {
	Message string
}

// flattenResponse flattens the response from the Gemini API into a single string.
func flattenResponse(resp *genai.GenerateContentResponse) string {
	var rtn strings.Builder
	for i, part := range resp.Candidates[0].Content.Parts {
		switch part := part.(type) {
		case genai.Text:
			if i > 0 {
				rtn.WriteString(" ")
			}
			rtn.WriteString(string(part))
		}
	}
	return rtn.String()
}

// Ask sends a single message to the Gemini API and returns the response.
//
//encore:api private method=POST path=/gemini/ask
func (p *Service) Ask(ctx context.Context, req *AskRequest) (*AskResponse, error) {
	session := p.client.StartChat()
	resp, err := session.SendMessage(ctx, genai.Text(req.Message))
	if err != nil {
		return nil, errors.Wrap(err, "send message")
	}
	return &AskResponse{Message: flattenResponse(resp)}, nil
}

// ContinueChat sends a series of messages to the Gemini API. The responses are streamed back to the chat service
// using a pubsub topic.
//
//encore:api private method=POST path=/gemini/continue-chat
func (p *Service) ContinueChat(ctx context.Context, req *provider.ChatRequest) (*provider.ContinueChatResponse, error) {
	var history []*genai.Content
	curMsg := &genai.Content{
		Role: "user",
	}
	if req.SystemMsg != "" {
		curMsg.Parts = append(curMsg.Parts, genai.Text(req.SystemMsg))
	}
	botNames := make(map[string]struct{})
	for _, b := range req.Bots {
		botNames[b.Name] = struct{}{}
	}
	// Gemini requires turned based conversation, so messages are aggregated by role.
	for _, m := range req.Messages {
		role := "user"
		if req.FromBot(m) {
			role = "model"
		}
		if curMsg.Role != role {
			if len(curMsg.Parts) > 0 {
				history = append(history, curMsg)
			}
			curMsg = &genai.Content{
				Role:  role,
				Parts: []genai.Part{},
			}
		}
		curMsg.Parts = append(curMsg.Parts, genai.Text(req.Format(m)))
	}
	session := p.client.StartChat()
	session.History = history
	resp, err := session.SendMessage(ctx, curMsg.Parts...)
	if err != nil {
		return nil, errors.Wrap(err, "send message")
	}
	err = req.Write(ctx, flattenResponse(resp)+"\n")
	return &provider.ContinueChatResponse{}, errors.Wrap(err, "write response")
}
