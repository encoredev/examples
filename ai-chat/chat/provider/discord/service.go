// Discord service provides functionality for interacting with Discord channels and users.
// It implements the chat provider API
package discord

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/base64"
	"image"
	"image/png"
	"os"
	"os/signal"
	"strings"
	"syscall"

	discord "github.com/bwmarrin/discordgo"
	"github.com/cockroachdb/errors"
	"github.com/nfnt/resize"

	botsvc "encore.app/bot"
	botdb "encore.app/bot/db"
	"encore.app/chat/provider"
	"encore.app/chat/provider/discord/db"
	chatdb "encore.app/chat/service/db"
	"encore.dev/rlog"
	"encore.dev/storage/sqldb"
)

// This uses Encore's declarative database , learn more: https://encore.dev/docs/primitives/databases
var discorddb = sqldb.NewDatabase("discord", sqldb.DatabaseConfig{
	Migrations: "./db/migrations",
})

// This uses Encore's built-in secrets manager, learn more: https://encore.dev/docs/primitives/secrets
var secrets struct {
	DiscordToken string
}

// This declares a Encore Service, learn more: https://encore.dev/docs/primitives/services-and-apis/service-structs
//
//encore:service
type Service struct {
	client *discord.Session
}

// initService initializes the Discord service by creating a client and subscribing to messages.
func initService() (*Service, error) {
	// Don't try to initialize the service if the discord token is not set
	if secrets.DiscordToken == "" {
		return nil, nil
	}
	client, err := discord.New("Bot " + secrets.DiscordToken)
	if err != nil {
		return nil, err
	}
	svc := &Service{client: client}
	err = svc.subscribeToMessages(context.Background(), func(ctx context.Context, msg *discord.MessageCreate) error {
		message := toProviderMessage(msg.Message)
		if message == nil {
			return nil
		}
		_, err := provider.InboxTopic.Publish(ctx, message)
		return errors.Wrap(err, "publish message")
	})
	if err != nil {
		return nil, errors.Wrap(err, "subscribe to messages")
	}
	return svc, nil
}

// Ping returns an error if the Discord service is not available.
// encore:api private
func (p *Service) Ping(ctx context.Context) error {
	if p == nil {
		return errors.New("Discord service is not available. Add DiscordToken secret to enable it.")
	}
	return nil
}

// ListChannels returns a list of channels in all the guilds the bot is a part of.
//
//encore:api private method=GET path=/discord/channels
func (p *Service) ListChannels(ctx context.Context) (*provider.ListChannelsResponse, error) {
	guilds, err := p.client.UserGuilds(100, "", "", false)
	if err != nil {
		return nil, errors.Wrap(err, "error getting guilds")
	}
	var channelInfos []provider.ChannelInfo
	for _, guild := range guilds {
		channels, err := p.client.GuildChannels(guild.ID)
		if err != nil {
			return nil, errors.Wrap(err, "error getting guilds")
		}
		for _, channel := range channels {
			channelInfos = append(channelInfos, provider.ChannelInfo{
				Provider: chatdb.ProviderDiscord,
				ID:       channel.ID,
				Name:     channel.Name,
			})
		}
	}
	return &provider.ListChannelsResponse{Channels: channelInfos}, nil
}

// subscribeToMessages subscribes to messages from the Discord client and publishes them to the message topic.
func (p *Service) subscribeToMessages(ctx context.Context, fn func(ctx context.Context, msg *discord.MessageCreate) error) error {
	p.client.AddHandler(func(sess *discord.Session, msg *discord.MessageCreate) {
		err := fn(ctx, msg)
		if err != nil {
			rlog.Error("error handling message: %v", err)
		}
	})

	p.client.Identify.Intents = discord.IntentGuildMessages | discord.IntentMessageContent

	// Open the websocket and begin listening.
	err := p.client.Open()
	if err != nil {
		return errors.Wrap(err, "error opening Discord session")
	}
	rlog.Info("Discord subscription is running.")

	go func() {
		sc := make(chan os.Signal, 1)
		signal.Notify(sc, syscall.SIGINT, syscall.SIGTERM, os.Interrupt)
		<-sc
		rlog.Info("Discord subscription is shutting down.")
		_ = p.client.Close()
	}()
	return nil
}

// GetUser returns a user by ID.
//
//encore:api private method=GET path=/discord/users/:userID
func (p *Service) GetUser(ctx context.Context, userID string) (*provider.User, error) {
	_, username, isBot := strings.Cut(userID, ":")
	if isBot {
		return &provider.User{
			ID:   userID,
			Name: username,
		}, nil
	}
	user, err := p.client.User(userID)
	if err != nil {
		return nil, errors.Wrap(err, "error getting user")
	}
	return &provider.User{
		ID:   userID,
		Name: user.GlobalName,
	}, nil
}

// LeaveChannel leaves a channel by deleting the webhook associated with the bot.
//
//encore:api private method=POST path=/discord/channels/:channelID/leave
func (c *Service) LeaveChannel(ctx context.Context, channelID string, bot *botdb.Bot) error {
	q := db.New()
	webhook, err := q.GetWebhookForBot(ctx, discorddb.Stdlib(), db.GetWebhookForBotParams{
		Channel: channelID,
		BotID:   bot.ID,
	})
	if err != nil {
		return errors.Wrap(err, "error getting webhook")
	}
	err = c.client.WebhookDelete(webhook.ProviderID)
	if err != nil {
		return errors.Wrap(err, "error deleting webhook")
	}
	_, err = q.DeleteWebhook(ctx, discorddb.Stdlib(), webhook.ID)
	if err != nil {
		return errors.Wrap(err, "error deleting webhook")
	}
	return nil
}

// generateAvatarDataURI generates a data URI for the avatar image. The image is resized to 128x128 if it's larger.
// The data URI is a base64 encoded string of the image.
func generateAvatarDataURI(data []byte) (string, error) {
	img, _, err := image.Decode(bytes.NewReader(data))
	if err != nil {
		return "", errors.Wrap(err, "error decoding image")
	}
	if img.Bounds().Dx() > 256 || img.Bounds().Dy() > 256 {
		img = resize.Resize(128, 128, img, resize.Lanczos3)
		buffer := new(bytes.Buffer)
		err = png.Encode(buffer, img)
		if err != nil {
			return "", errors.Wrap(err, "error encoding image")
		}
		data = buffer.Bytes()
	}
	b64Data := base64.StdEncoding.EncodeToString(data)
	return "data:image/png;base64," + b64Data, nil
}

// JoinChannel joins a channel by creating a webhook for the bot. We use webhooks instead of bots directly
// to be able to customize the bot's name and avatar.
//
//encore:api private method=POST path=/discord/channels/:channelID/join
func (c *Service) JoinChannel(ctx context.Context, channelID string, bot *botdb.Bot) error {
	var err error
	avatarURI := ""
	if avatar, err := botsvc.AvatarBlob(ctx, bot.ID); err == nil && avatar != nil {
		avatarURI, err = generateAvatarDataURI(avatar.Avatar)
		if err != nil {
			return errors.Wrap(err, "error generating avatar data URI")
		}
	}
	q := db.New()
	hook, err := q.GetWebhookForBot(ctx, discorddb.Stdlib(), db.GetWebhookForBotParams{
		Channel: channelID,
		BotID:   bot.ID,
	})
	if errors.Is(err, sql.ErrNoRows) {
		hook, err := c.client.WebhookCreate(channelID, bot.Name, avatarURI)
		if err != nil {
			return errors.Wrap(err, "error creating webhook")
		}
		_, err = q.InsertWebhook(ctx, discorddb.Stdlib(), db.InsertWebhookParams{
			ProviderID: hook.ID,
			Channel:    hook.ChannelID,
			Name:       hook.Name,
			Token:      hook.Token,
			BotID:      bot.ID,
		})
		if err != nil {
			return errors.Wrap(err, "error inserting webhook")
		}
		return nil
	} else if err != nil {
		return errors.Wrap(err, "error getting webhook")
	}
	_, err = c.client.WebhookEdit(hook.ProviderID, bot.Name, avatarURI, channelID)
	if err != nil {
		return errors.Wrap(err, "error editing webhook")
	}
	return nil
}

// SendMessage sends a message to a channel using the bot's webhook.
//
//encore:api private method=POST path=/discord/channels/:channelID/messages
func (c *Service) SendMessage(ctx context.Context, channelID string, req *provider.SendMessageRequest) error {
	webhook, err := db.New().GetWebhookForBot(ctx, discorddb.Stdlib(), db.GetWebhookForBotParams{
		Channel: channelID,
		BotID:   req.Bot.ID,
	})
	if err != nil {
		return errors.Wrap(err, "error getting webhook")
	}
	_, err = c.client.WebhookExecute(webhook.ProviderID, webhook.Token, false, &discord.WebhookParams{
		Content:  req.Content,
		Username: req.Bot.Name,
	})
	return errors.Wrap(err, "error sending message")
}

// toProviderMessage converts a Discord message to the generic provider message.
func toProviderMessage(msg *discord.Message) *provider.Message {
	if msg.Content == "" || msg.Type != discord.MessageTypeDefault {
		return nil
	}
	author := provider.User{
		ID:   msg.Author.ID,
		Name: msg.Author.Username,
	}
	if msg.Author.Bot {
		author.ID = msg.Author.ID + ":" + msg.Author.Username
		hook, err := db.New().GetWebhookByID(context.Background(), discorddb.Stdlib(), msg.Author.ID)
		if err == nil {
			author.BotID = hook.BotID
		}
	}
	return &provider.Message{
		Provider:   chatdb.ProviderDiscord,
		ProviderID: msg.ID,
		ChannelID:  msg.ChannelID,
		Author:     author,
		Content:    msg.Content,
		Time:       msg.Timestamp.UTC(),
	}
}

// ListMessages returns a list of messages in a channel.
//
//encore:api private method=GET path=/discord/channels/:channelID/messages
func (c *Service) ListMessages(ctx context.Context, channelID string, req *provider.ListMessagesRequest) (*provider.ListMessagesResponse, error) {
	msgs, err := c.client.ChannelMessages(channelID, 100, "", req.FromMessageID, "")
	if err != nil {
		return nil, errors.Wrap(err, "error getting messages")
	}
	var messages []*provider.Message
	for i := len(msgs) - 1; i >= 0; i-- {
		if msg := toProviderMessage(msgs[i]); msg != nil {
			messages = append(messages, msg)
		}
	}
	return &provider.ListMessagesResponse{Messages: messages}, nil
}

// ChannelInfo returns information about a channel.
//
//encore:api private method=GET path=/discord/channels/:channelID/info
func (c *Service) ChannelInfo(ctx context.Context, channelID string) (provider.ChannelInfo, error) {
	resp, err := c.client.Channel(channelID)
	if err != nil {
		return provider.ChannelInfo{}, errors.Wrap(err, "error getting channel info")
	}
	return provider.ChannelInfo{
		Provider: chatdb.ProviderDiscord,
		ID:       provider.ChannelID(resp.ID),
		Name:     resp.Name,
	}, nil
}
