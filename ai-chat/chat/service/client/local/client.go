package local

import (
	"context"

	botdb "encore.app/bot/db"
	"encore.app/chat/provider"
	"encore.app/chat/provider/local"
	"encore.app/chat/service/client"
	chatdb "encore.app/chat/service/db"
	"encore.dev/types/uuid"
)

func NewClient(ctx context.Context) (*Client, bool) {
	if err := local.Ping(ctx); err != nil {
		return nil, false
	}
	return &Client{}, true
}

// Client wraps the discord service endpoints to implement the chat client interface.
type Client struct{}

func (p *Client) ListChannels(ctx context.Context) ([]provider.ChannelInfo, error) {
	return nil, nil
}

func (p *Client) GetUser(ctx context.Context, id provider.UserID) (*provider.User, error) {
	return &provider.User{
		ID:   id,
		Name: id,
	}, nil
}

func (p *Client) GetChannelClient(ctx context.Context, id provider.ChannelID) client.ChannelClient {
	return &Channel{
		Client:    p,
		channelID: id,
	}
}

type Channel struct {
	*Client
	channelID string
}

func (c *Channel) Typing(ctx context.Context, botID uuid.UUID) error {
	return local.SendTyping(ctx, c.channelID, botID)
}

func (c *Channel) Send(ctx context.Context, req *provider.SendMessageRequest) error {
	return local.SendMessage(ctx, c.channelID, req)
}

func (c *Channel) ListMessages(ctx context.Context, from *chatdb.Message) ([]*provider.Message, error) {
	return nil, nil
}

func (c *Channel) Info(ctx context.Context) (provider.ChannelInfo, error) {
	return provider.ChannelInfo{
		Provider: chatdb.ProviderLocalchat,
		ID:       c.channelID,
		Name:     c.channelID,
	}, nil
}

func (c *Channel) Join(ctx context.Context, bot *botdb.Bot) error {
	return local.JoinChannel(ctx, c.channelID, bot)
}

func (c *Channel) Leave(ctx context.Context, bot *botdb.Bot) error {
	return nil
}

var (
	_ client.Client        = (*Client)(nil)
	_ client.ChannelClient = (*Channel)(nil)
)
