// The bot service is responsible for managing bots. It allows creating, listing, getting, and deleting bots.
// It also provides an endpoint to get the avatar of a bot which is exposed as a raw endpoint.
package bot

import (
	"bytes"
	"context"
	"net/http"
	"strings"
	"time"

	"github.com/cockroachdb/errors"

	"encore.app/bot/db"
	"encore.app/llm/service"
	"encore.dev/storage/sqldb"
	"encore.dev/types/uuid"
)

type BotID = uuid.UUID

// This uses Encore's declarative database , learn more: https://encore.dev/docs/primitives/databases
var botdb = sqldb.NewDatabase("bot", sqldb.DatabaseConfig{
	Migrations: "./db/migrations",
})

// This declares a Encore Service, learn more: https://encore.dev/docs/primitives/services-and-apis/service-structs
//
//encore:service
type Service struct{}

type CreateBotRequest struct {
	Name   string `json:"name"`
	Prompt string `json:"prompt"`
	LLM    string `json:"llm"`
}

// Create creates a new bot with the given name, prompt, and LLM provider. It will generate a profile description
// and an avatar (if the chosen llm provider supports it).
//
//encore:api public method=POST path=/bots
func (svc *Service) Create(ctx context.Context, req *CreateBotRequest) (*db.Bot, error) {
	if req.Name == "" || req.Prompt == "" || req.LLM == "" {
		return nil, errors.New("name, prompt, and llm are required")
	}
	resp, err := llm.GenerateBotProfile(ctx, &llm.GenerateBotProfileRequest{
		Name:     req.Name,
		Prompt:   req.Prompt,
		Provider: req.LLM,
	})
	if err != nil {
		return nil, errors.Wrap(err, "generate bot profile")
	}
	q := db.New()
	bot, err := q.InsertBot(ctx, botdb.Stdlib(), db.InsertBotParams{
		Name:     req.Name,
		Profile:  resp.Profile,
		Prompt:   req.Prompt,
		Provider: req.LLM,
	})
	if err != nil {
		return nil, errors.Wrap(err, "insert bot")
	}
	if resp.Avatar != nil {
		err := q.InsertAvatar(ctx, botdb.Stdlib(), db.InsertAvatarParams{
			BotID:  bot.ID,
			Avatar: resp.Avatar,
		})
		if err != nil {
			return nil, errors.Wrap(err, "insert avatar")
		}
	}
	return bot, nil
}

type Bots struct {
	Bots []*db.Bot `json:"bots"`
}

type ListBotRequest struct {
	IDs []uuid.UUID `json:"ids"`
}

// List returns a list of bots. If IDs is empty, it will return all bots.
//
//encore:api public method=GET path=/bots
func (svc *Service) List(ctx context.Context, req *ListBotRequest) (*Bots, error) {
	bots, err := func() ([]*db.Bot, error) {
		if len(req.IDs) == 0 {
			return db.New().ListBot(ctx, botdb.Stdlib())
		}
		return db.New().GetBots(ctx, botdb.Stdlib(), req.IDs)
	}()
	if err != nil {
		return nil, err
	}
	return &Bots{Bots: bots}, nil
}

// Get returns a bot by ID.
//
//encore:api public method=GET path=/bots/:id
func (svc *Service) Get(ctx context.Context, id uuid.UUID) (*db.Bot, error) {
	return db.New().GetBot(ctx, botdb.Stdlib(), id)
}

// GetAvatar returns the avatar byte blob
//
//encore:api private method=GET path=/bots/:id/avatar/blob
func (svc *Service) AvatarBlob(ctx context.Context, id uuid.UUID) (*db.Avatar, error) {
	res, err := db.New().GetAvatar(ctx, botdb.Stdlib(), id)
	if err != nil {
		return nil, errors.Wrap(err, "get avatar")
	}
	return res, nil
}

// Delete deletes a bot by ID.
//
//encore:api private method=DELETE path=/bots/:id
func (svc *Service) Delete(ctx context.Context, id uuid.UUID) (*db.Bot, error) {
	return db.New().DeleteBot(ctx, botdb.Stdlib(), id)
}

// Avatar returns the avatar image of a bot by ID.
//
//encore:api public raw path=/bots/:id/avatar
func (*Service) Avatar(w http.ResponseWriter, req *http.Request) {
	q := db.New()
	id := strings.TrimPrefix(req.RequestURI, "/bots/")
	id = strings.TrimSuffix(id, "/avatar")
	uid, err := uuid.FromString(id)
	if err != nil {
		http.Error(w, "Invalid bot uuid", http.StatusBadRequest)
		return
	}
	bot, err := q.GetAvatar(req.Context(), botdb.Stdlib(), uid)
	if err != nil {
		http.Error(w, "Bot not found", http.StatusNotFound)
		return
	}
	if bot.Avatar == nil {
		http.Error(w, "Bot has no avatar", http.StatusNotFound)
		return
	}
	w.Header().Set("Cache-Control", "public, max-age=31536000")
	http.ServeContent(w, req, "avatar.png", time.Now(), bytes.NewReader(bot.Avatar))
}
