// The LLM service is responsible for processing tasks related to the AI. It receives tasks from the chat service
// and forwards requests to LLM providers.
package llm

import (
	"bytes"
	"context"
	"fmt"
	"image/png"
	"strings"
	"sync"
	"time"

	"github.com/cockroachdb/errors"
	"github.com/nfnt/resize"

	botdb "encore.app/bot/db"
	chatdb "encore.app/chat/service/db"
	"encore.app/llm/provider"
	"encore.app/llm/service/client"
	"encore.app/llm/service/client/gemini"
	"encore.app/llm/service/client/openai"
	"encore.dev/types/uuid"
)

type ChatRequest struct {
	Bots        []*botdb.Bot
	Users       []*chatdb.User
	Channel     *chatdb.Channel
	Messages    []*chatdb.Message
	AdminPrompt string
	Provider    string
}

type channelTasks map[uuid.UUID]map[string]string

func (c *channelTasks) add(channelID uuid.UUID, provider, taskID string) {
	if (*c)[channelID] == nil {
		(*c)[channelID] = map[string]string{}
	}
	(*c)[channelID][provider] = taskID
}

func (c channelTasks) get(channelID uuid.UUID, provider string) (string, bool) {
	if c[channelID] == nil {
		return "", false
	}
	taskID, ok := c[channelID][provider]
	return taskID, ok
}

// This declares a Encore Service, learn more: https://encore.dev/docs/primitives/services-and-apis/service-structs
//
//encore:service
type Service struct {
	providers    map[string]client.Client
	mu           sync.Mutex
	channelTasks channelTasks
}

// initService is the constructor for the LLM service. It initializes the LLM providers.
func initService() (*Service, error) {
	ctx := context.Background()
	svc := &Service{
		providers:    map[string]client.Client{},
		channelTasks: channelTasks{},
	}
	if openaiClient, ok := openai.NewClient(ctx); ok {
		svc.providers["openai"] = openaiClient
	}
	if geminiClient, ok := gemini.NewClient(ctx); ok {
		svc.providers["gemini"] = geminiClient
	}
	return svc, nil
}

// Instruct sends a message to the AI provider to instruct the bot to perform an action.
//
//encore:api private path=/ai/instruct
func (svc *Service) Instruct(ctx context.Context, req *provider.ChatRequest) (*provider.ContinueChatResponse, error) {
	return svc.continueChat(ctx, req, true)
}

// ContinueChat continues a chat conversation with the AI provider. It is called per channel and llm provider
//
//encore:api private path=/ai/chat
func (svc *Service) ContinueChat(ctx context.Context, req *provider.ChatRequest) (*provider.ContinueChatResponse, error) {
	req.SystemMsg = req.SystemMsg + string(continueChatPrompt)
	req.Type = provider.TaskTypeContinue
	return svc.continueChat(ctx, req, true)
}

func (svc *Service) Prepopulate(ctx context.Context, req *provider.ChatRequest) (*provider.ContinueChatResponse, error) {
	req.SystemMsg = req.SystemMsg + fmt.Sprintf(string(prepopulatePrompt), req.Channel.Name)
	req.Type = provider.TaskTypePrepopulate
	return svc.continueChat(ctx, req, true)
}

// Introduce sends a message to the AI provider to introduce the bot to the channel.
//
//encore:api private path=/ai/introduce
func (svc *Service) Introduce(ctx context.Context, req *provider.ChatRequest) (*provider.ContinueChatResponse, error) {
	req.SystemMsg = req.SystemMsg + fmt.Sprintf(string(introPrompt), req.Channel.Name)
	req.Type = provider.TaskTypeJoin
	return svc.continueChat(ctx, req, true)
}

// Goodbye sends a message to the AI provider to say goodbye to the channel.
//
//encore:api private path=/ai/goodbye
func (svc *Service) Goodbye(ctx context.Context, req *provider.ChatRequest) (*provider.ContinueChatResponse, error) {
	req.SystemMsg = req.SystemMsg + fmt.Sprintf(string(goodbyePrompt), req.Channel)
	req.Type = provider.TaskTypeLeave
	return svc.continueChat(ctx, req, true)
}

type GenerateBotProfileRequest struct {
	Name     string `json:"name"`
	Prompt   string `json:"prompt"`
	Provider string `json:"provider"`
}

type GenerateBotResponse struct {
	Profile string `json:"profile"`
	Avatar  []byte
}

// GenerateBotProfile generates a bot profile and avatar using the specified provider.
//
//encore:api private method=POST path=/ai/bot
func (svc *Service) GenerateBotProfile(ctx context.Context, req *GenerateBotProfileRequest) (*GenerateBotResponse, error) {
	prov, ok := svc.providers[req.Provider]
	if !ok {
		return nil, errors.Newf("provider not found: %s", req.Provider)
	}
	resp, err := prov.Ask(ctx, fmt.Sprintf(string(botPrompt), req.Name, req.Prompt))
	if err != nil {
		return nil, errors.Wrap(err, "ask")
	}
	resp = strings.TrimPrefix(resp, "```")
	resp = strings.TrimSuffix(resp, "```")
	img, err := svc.generateAvatar(ctx, req.Provider, resp)
	if err != nil {
		return nil, errors.Wrap(err, "generate avatar")
	}
	return &GenerateBotResponse{Profile: resp, Avatar: img}, nil
}

// formatBotProfiles formats a system message for the llm provider with the name
// and profile of each bot.
func formatBotProfiles(bots []*botdb.Bot) string {
	res := strings.Builder{}
	for i, b := range bots {
		res.WriteString(fmt.Sprintf("%d: ", i))
		res.WriteString(b.Profile)
		res.WriteString("\n")
	}
	return res.String()
}

// formatResponsePrompt formats a response instruction for the llm provider with the names
// of the bots it can use to reply.
func formatResponsePrompt(bots []*botdb.Bot) string {
	users := strings.Builder{}
	for i, user := range bots {
		if i > 0 {
			users.WriteString(", ")
		}
		users.WriteString(user.Name)
	}
	names := strings.TrimSuffix(users.String(), ", ")
	return fmt.Sprintf(string(responsePrompt), names)
}

func (svc *Service) cancelLastTask(ctx context.Context, provider string, channelID uuid.UUID) error {
	svc.mu.Lock()

	taskID, ok := svc.channelTasks.get(channelID, provider)
	svc.mu.Unlock()
	if !ok {
		return nil
	}
	prov, ok := svc.providers[provider]
	if !ok {
		return errors.Newf("provider not found: %s", provider)
	}
	err := prov.CancelTask(ctx, taskID)
	if err != nil {
		return errors.Wrap(err, "cancel task")
	}
	return nil
}

// continueChat continues a chat conversation with the AI provider. It is used by all the other ai tasks
func (svc *Service) continueChat(ctx context.Context, req *provider.ChatRequest, cancelPrevious bool) (*provider.ContinueChatResponse, error) {
	if cancelPrevious {
		err := svc.cancelLastTask(ctx, req.Provider, req.Channel.ID)
		if err != nil {
			return nil, errors.Wrap(err, "cancel last task")
		}
	}
	prov, ok := svc.providers[req.Provider]
	if !ok {
		return nil, errors.Newf("provider not found: %s", req.Provider)
	}
	botByName := make(map[string]*botdb.Bot)
	for _, b := range req.Bots {
		botByName[strings.ToLower(b.Name)] = b
	}
	req.Messages = append(req.Messages, &chatdb.Message{
		ChannelID: req.Channel.ID,
		AuthorID:  chatdb.Admin.ID,
		Content:   req.SystemMsg + formatResponsePrompt(req.Bots),
		Timestamp: time.Now().UTC(),
	})
	req.SystemMsg = fmt.Sprintf(string(personaPrompt), formatBotProfiles(req.Bots))
	resp, err := prov.ContinueChat(ctx, req)
	if err != nil {
		return nil, errors.Wrap(err, "continue chat")
	}
	if cancelPrevious {
		svc.mu.Lock()
		defer svc.mu.Unlock()
		svc.channelTasks.add(req.Channel.ID, req.Provider, resp.TaskID)
	}
	return resp, errors.Wrap(err, "continue chat")
}

// generateAvatar generates an avatar for the bot using the specified provider.
// it's a helper function to resize and encode images returned by llm providers
func (svc *Service) generateAvatar(ctx context.Context, provider, prompt string) ([]byte, error) {
	prov, ok := svc.providers[provider]
	if !ok {
		return nil, errors.Wrap(errors.New("provider not found"), "generate avatar")
	}
	img, err := prov.GenerateAvatar(ctx, fmt.Sprintf(string(avatarPrompt), prompt))
	if err != nil {
		return nil, err
	}
	if img == nil {
		return nil, nil
	}
	if img.Bounds().Dx() > 256 {
		img = resize.Resize(256, 0, img, resize.Lanczos3)
	}
	buffer := new(bytes.Buffer)
	err = png.Encode(buffer, img)
	if err != nil {
		return nil, errors.Wrap(err, "encode image")
	}
	return buffer.Bytes(), nil
}
