// The chat service is the main coordinator. It connects the chat providers with the bot service and the LLM service.
// It forwards messages from chat providers to the LLM service and vice versa.
// It uses the bot service to retrieve bot profiles to forward to the LLM service.
package chat

import (
	"context"

	"github.com/cockroachdb/errors"

	"encore.app/chat/service/client"
	"encore.app/chat/service/client/discord"
	"encore.app/chat/service/client/local"
	"encore.app/chat/service/client/slack"
	"encore.app/chat/service/db"
	"encore.dev/storage/sqldb"
)

// This uses Encore's declarative database , learn more: https://encore.dev/docs/primitives/databases
var chatdb = sqldb.NewDatabase("chat", sqldb.DatabaseConfig{
	Migrations: "./db/migrations",
})

// This declares a Encore Service, learn more: https://encore.dev/docs/primitives/services-and-apis/service-structs
//
//encore:service
type Service struct {
	providers map[db.Provider]client.Client
}

// initService is the constructor for the chat service. It initializes the chat providers and loads all channels.
func initService() (*Service, error) {
	ctx := context.Background()
	svc := &Service{
		providers: map[db.Provider]client.Client{},
	}
	if localchatClient, ok := local.NewClient(ctx); ok {
		svc.providers[db.ProviderLocalchat] = localchatClient
	}
	if discordClient, ok := discord.NewClient(ctx); ok {
		svc.providers[db.ProviderDiscord] = discordClient
	}
	if slackClient, ok := slack.NewClient(ctx); ok {
		svc.providers[db.ProviderSlack] = slackClient
	}
	err := svc.initChannels(ctx)
	if err != nil {
		return nil, errors.Wrap(err, "init channels")
	}
	return svc, nil
}
