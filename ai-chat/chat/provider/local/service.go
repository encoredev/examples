// The local service is a simple chat provider which allows users to chat with bots (and eachother) in a hosted web chat
package local

import (
	"context"
	"embed"
	"net/http"
	"strings"
	"time"

	"github.com/cockroachdb/errors"
	_ "github.com/gorilla/websocket"

	"encore.app/bot"
	botdb "encore.app/bot/db"
	"encore.app/chat/provider"
	"encore.app/chat/provider/local/chat"
	chatdb "encore.app/chat/service/db"
	"encore.app/pkg/fns"
	"encore.dev/config"
	"encore.dev/rlog"
	"encore.dev/types/uuid"
)

type Config struct {
	Enabled config.Bool
}

var cfg = config.Load[*Config]()

//encore:service
type Service struct {
	hub  *chat.Hub
	data *DataSource
}

func initService() (*Service, error) {
	if !cfg.Enabled() {
		return nil, nil
	}
	svc := &Service{}
	svc.hub = chat.NewHub(context.Background(), svc.handleClientMessage)
	return svc, nil
}

// CloseAllClients is an admin endpoint to forcefully terminate all client websocket connections.
//
//encore:api private
func (p *Service) CloseAllClients(ctx context.Context) error {
	if p == nil {
		return nil
	}
	p.hub.CloseAllClients()
	return nil
}

// Ping returns an error if the Discord service is not available.
//
// encore:api private
func (p *Service) Ping(ctx context.Context) error {
	if p == nil {
		return errors.New("Encore chat service is not available for this environment. Set Enabled to true in the config to enable it.")
	}
	return nil
}

//go:embed static/build/*
var staticFiles embed.FS

// ServeHTML serves the static HTML files for the chat provider.
//
//encore:api public raw path=/!fallback
func (s *Service) ServeHTML(w http.ResponseWriter, r *http.Request) {
	if !cfg.Enabled() {
		http.Error(w, "not enabled", http.StatusNotFound)
		return
	}
	path := r.URL.Path
	if path == "/" || strings.HasPrefix(path, "/chat") {
		path = "/index.html"
	}
	path = "/static/build" + path
	http.ServeFileFS(w, r, staticFiles, path)
}

type BotInfo struct {
	ID     uuid.UUID `json:"id"`
	Name   string    `json:"name"`
	Avatar string    `json:"avatar"`
}

type ListBotResponse struct {
	Bots []BotInfo `json:"bots"`
}

// ListBots returns a list of all available bots.
//
//encore:api public method=GET path=/localchat/bots
func (s *Service) ListBots(ctx context.Context) (*ListBotResponse, error) {
	bots, err := bot.List(ctx, &bot.ListBotRequest{})
	if err != nil {
		return nil, errors.Wrap(err, "list bots")
	}
	return &ListBotResponse{
		Bots: fns.Map(bots.Bots, func(bot *botdb.Bot) BotInfo {
			return BotInfo{
				ID:     bot.ID,
				Name:   bot.Name,
				Avatar: bot.GetAvatarURL(),
			}
		}),
	}, nil

}

// Subscribe is a websocket endpoint for clients to subscribe to chat messages.
//
//encore:api public raw path=/localchat/subscribe
func (s *Service) Subscribe(w http.ResponseWriter, r *http.Request) {
	if !cfg.Enabled() {
		http.Error(w, "not enabled", http.StatusNotFound)
		return
	}
	err := s.hub.Subscribe(w, r)
	if err != nil {
		rlog.Error("upgrade", "error", err)
		http.Error(w, "upgrade connection", http.StatusInternalServerError)
		return
	}
}

// JoinChannel broadcasts a message to all clients that a bot has joined a channel.
//
//encore:api private method=POST path=/localchat/channels/:channelID/join
func (s *Service) JoinChannel(ctx context.Context, channelID string, bot *botdb.Bot) error {
	s.hub.BroadCast(ctx, &chat.ClientMessage{
		Type:           "join",
		UserId:         "b-" + bot.ID.String(),
		ConversationId: channelID,
		Content:        bot.Profile,
		Avatar:         bot.GetAvatarURL(),
		Username:       bot.Name,
	})
	return nil
}

func (s *Service) sendChannelHistory(ctx context.Context, channelID string, afterID string, client *chat.Client) error {
	channel, err := s.data.GetChannel(ctx, channelID)
	if err != nil {
		return errors.Wrap(err, "get channel")
	}
	if channel == nil {
		_, err := provider.InboxTopic.Publish(ctx, &provider.Message{
			Provider:   chatdb.ProviderLocalchat,
			ProviderID: uuid.Must(uuid.NewV4()).String(),
			ChannelID:  channelID,
			Time:       time.Now(),
			Type:       "channel_created",
		})
		return errors.Wrap(err, "publish message")
	} else {
		users, bots, err := s.data.GetChannelUsers(ctx, channel)
		if err != nil {
			return errors.Wrap(err, "get channel users")
		}
		for _, user := range users {
			if user.BotID == nil {
				client.SendMessage(&chat.ClientMessage{
					Type:           "join",
					UserId:         user.Name,
					ConversationId: channelID,
					Username:       user.Name,
				})
			}
		}
		for _, bot := range bots {
			client.SendMessage(&chat.ClientMessage{
				Type:           "join",
				UserId:         "b-" + bot.ID.String(),
				ConversationId: channelID,
				Username:       bot.Name,
				Content:        bot.Profile,
				Avatar:         bot.GetAvatarURL(),
			})
		}
		var msgs []*chatdb.Message
		if afterID != "" {
			msgs, err = s.data.GetChannelMessagesAfter(ctx, channel, afterID)
		} else {
			msgs, err = s.data.GetChannelMessages(ctx, channel)
		}
		if err != nil {
			return errors.Wrap(err, "get channel messages")
		}
		usersByID := fns.ToMap(users, func(user *chatdb.User) uuid.UUID { return user.ID })
		for _, msg := range msgs {
			userID := "Unknown"
			if user, ok := usersByID[msg.AuthorID]; ok {
				userID = user.ProviderID
			}
			client.SendMessage(&chat.ClientMessage{
				ID:             msg.ID.String(),
				Type:           "message",
				UserId:         userID,
				ConversationId: channelID,
				Content:        msg.Content,
			})
		}
		return nil
	}
}

func (s *Service) handleClientMessage(ctx context.Context, clientMsg *chat.ClientMessage) error {
	if clientMsg.Type == "reconnect" && clientMsg.Client != nil {
		for _, channel := range clientMsg.Conversations {
			err := s.sendChannelHistory(ctx, channel.ID, channel.LastMessageID, clientMsg.Client)
			if err != nil {
				return errors.Wrap(err, "send channel history")
			}
		}
		return nil
	} else if clientMsg.Type == "join" && clientMsg.Client != nil {
		return s.sendChannelHistory(ctx, clientMsg.ConversationId, "", clientMsg.Client)
	} else if clientMsg.Type != "message" {
		return nil
	}
	var botID uuid.UUID
	if id, ok := strings.CutPrefix(clientMsg.UserId, "b-"); ok {
		botID, _ = uuid.FromString(id)
	}
	_, err := provider.InboxTopic.Publish(ctx, &provider.Message{
		Provider:   chatdb.ProviderLocalchat,
		ProviderID: clientMsg.ID,
		ChannelID:  clientMsg.ConversationId,
		Author: provider.User{
			ID:    clientMsg.UserId,
			Name:  clientMsg.UserId,
			BotID: botID,
		},
		Content: clientMsg.Content,
		Time:    time.Now(),
		Type:    clientMsg.Type,
	})
	return errors.Wrap(err, "publish message")
}

// SendTyping broadcasts a typing message to all clients in a channel.
//
//encore:api private method=POST path=/localchat/channels/:channelID/bots/:botID
func (s *Service) SendTyping(ctx context.Context, channelID string, botID uuid.UUID) error {
	s.hub.BroadCast(ctx, &chat.ClientMessage{
		Type:           "typing",
		UserId:         "b-" + botID.String(),
		ConversationId: channelID,
	})
	return nil
}

// SendMessage broadcasts a message to all connected clients in a channel.
//
//encore:api private method=POST path=/localchat/channels/:channelID/messages
func (s *Service) SendMessage(ctx context.Context, channelID string, req *provider.SendMessageRequest) error {
	if req.Bot == nil {
		return errors.New("only bots can send messages")
	}
	s.hub.BroadCast(ctx, &chat.ClientMessage{
		ID:             req.ID,
		Type:           req.Type,
		UserId:         "b-" + req.Bot.ID.String(),
		ConversationId: channelID,
		Content:        req.Content,
	})
	return nil
}
