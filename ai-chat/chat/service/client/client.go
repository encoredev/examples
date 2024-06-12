package client

import (
	"context"

	botdb "encore.app/bot/db"
	"encore.app/chat/provider"
	"encore.app/chat/service/db"
	"encore.dev/types/uuid"
)

// Client is a generic interface implemented by all chat providers
type Client interface {
	// ListChannels lists all channels in the provider
	ListChannels(ctx context.Context) ([]provider.ChannelInfo, error)
	// GetChannelClient gets a client for a specific channel
	GetChannelClient(ctx context.Context, id provider.ChannelID) ChannelClient
	// GetUser gets a user by ID
	GetUser(ctx context.Context, id provider.UserID) (*provider.User, error)
}

// ChannelClient is a client for a specific channel in a provider
type ChannelClient interface {
	// Send sends a message to the channel
	Send(ctx context.Context, req *provider.SendMessageRequest) error

	Typing(ctx context.Context, botID uuid.UUID) error
	// ListMessages lists messages in the channel
	ListMessages(ctx context.Context, from *db.Message) ([]*provider.Message, error)
	// GetInfo gets information about the channel
	Info(ctx context.Context) (provider.ChannelInfo, error)
	// Join joins the bot to the channel
	Join(ctx context.Context, bot *botdb.Bot) error
	// Leave leaves the bot from the channel
	Leave(ctx context.Context, bot *botdb.Bot) error
}
