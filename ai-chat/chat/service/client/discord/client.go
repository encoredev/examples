package discord

import (
	"context"

	"github.com/cockroachdb/errors"

	botdb "encore.app/bot/db"
	"encore.app/chat/provider"
	"encore.app/chat/provider/discord"
	"encore.app/chat/service/client"
	chatdb "encore.app/chat/service/db"
	"encore.dev/types/uuid"
)

func NewClient(ctx context.Context) (*Client, bool) {
	if discord.Ping(ctx) != nil {
		return nil, false
	}
	return &Client{}, true
}

// Client wraps the discord service endpoints to implement the chat client interface.
type Client struct{}

func (p *Client) ListChannels(ctx context.Context) ([]provider.ChannelInfo, error) {
	resp, err := discord.ListChannels(ctx)
	if err != nil {
		return nil, errors.Wrap(err, "list channels")
	}
	return resp.Channels, nil
}

func (p *Client) GetUser(ctx context.Context, id provider.UserID) (*provider.User, error) {
	return discord.GetUser(ctx, id)
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
	return nil
}

func (c *Channel) Send(ctx context.Context, req *provider.SendMessageRequest) error {
	return discord.SendMessage(ctx, c.channelID, req)
}

func (c *Channel) ListMessages(ctx context.Context, from *chatdb.Message) ([]*provider.Message, error) {
	fromID := ""
	if from != nil {
		fromID = from.ProviderID
	}
	resp, err := discord.ListMessages(ctx, c.channelID, &provider.ListMessagesRequest{FromMessageID: fromID})
	if err != nil {
		return nil, errors.Wrap(err, "list messages")
	}
	return resp.Messages, nil
}

func (c *Channel) Info(ctx context.Context) (provider.ChannelInfo, error) {
	return discord.ChannelInfo(ctx, c.channelID)
}

func (c *Channel) Join(ctx context.Context, bot *botdb.Bot) error {
	return discord.JoinChannel(ctx, c.channelID, bot)
}

func (c *Channel) Leave(ctx context.Context, bot *botdb.Bot) error {
	return discord.LeaveChannel(ctx, c.channelID, bot)
}

var (
	_ client.Client        = (*Client)(nil)
	_ client.ChannelClient = (*Channel)(nil)
)
