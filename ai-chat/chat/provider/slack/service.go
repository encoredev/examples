// Slack service provides functionality for interacting with slack channels and users.
// It implements the chat provider API
package slack

import (
	"context"
	"encoding/json"
	"fmt"
	"slices"
	"strconv"
	"strings"
	"time"

	"github.com/cockroachdb/errors"
	"github.com/slack-go/slack"

	botdb "encore.app/bot/db"
	"encore.app/chat/provider"
	chatdb "encore.app/chat/service/db"
	"encore.dev/rlog"
	"encore.dev/types/uuid"
)

const (
	BotIDPayload        = "bot_id"
	BotMessageEventType = "bot_message"
)

// This uses Encore's built-in secrets manager, learn more: https://encore.dev/docs/primitives/secrets
var secrets struct {
	SlackToken string
}

// This declares a Encore Service, learn more: https://encore.dev/docs/primitives/services-and-apis/service-structs
//
//encore:service
type Service struct {
	client *slack.Client
	botID  string
}

// initService initializes the Slack service by creating a client and retrieving the bot ID.
func initService() (*Service, error) {
	// Don't try to initialize the service if the slack token is not set
	if secrets.SlackToken == "" {
		return nil, nil
	}
	client := slack.New(secrets.SlackToken)
	resp, err := client.AuthTest()
	if err != nil {
		return nil, errors.Wrap(err, "auth test")
	}
	return &Service{
		client: client,
		botID:  resp.BotID,
	}, nil
}

// Ping returns an error if the service is not available.
// encore:api private
func (p *Service) Ping(ctx context.Context) error {
	if p == nil {
		return errors.New("Slack service is not available. Add SlackToken secret to enable it.")
	}
	return nil
}

type SlackEvent struct {
	Token     string          `json:"token"`
	Challenge string          `json:"challenge"`
	Type      string          `json:"type"`
	Event     json.RawMessage `json:"event"`
}

type ChallengeResponse struct {
	Challenge string `json:"challenge"`
}

// SlackEventHandler handles incoming slack messages and publishes them to the message topic.
// The webhook URL must be set in the slack app configuration.
// To test it locally, you can use the ngrok integration in the proxy package which automatically spins up
// a tunnel to your local machine. Learn more: https://ngrok.com/
//
//encore:api public path=/slack/message
func (svc *Service) SlackEventHandler(ctx context.Context, req *SlackEvent) (*ChallengeResponse, error) {
	switch req.Type {
	case "url_verification":
		return &ChallengeResponse{
			Challenge: req.Challenge,
		}, nil
	case "event_callback":
		discordMsg := Message{}
		err := json.Unmarshal(req.Event, &discordMsg)
		if err != nil {
			return nil, errors.Wrap(err, "unmarshal message")
		}
		msg := svc.toProviderMessage(discordMsg.Msg, discordMsg.Channel)
		// Some messages we just want to ignore
		if msg == nil {
			return nil, nil
		}
		_, err = provider.InboxTopic.Publish(ctx, msg)
		if err != nil {
			return nil, errors.Wrap(err, "publish message")
		}
	}
	return nil, nil
}

// ListChannels returns a list of channels in the slack workspace.
//
//encore:api private method=GET path=/slack/channels
func (s *Service) ListChannels(ctx context.Context) (*provider.ListChannelsResponse, error) {
	resp, _, err := s.client.GetConversationsContext(ctx, &slack.GetConversationsParameters{
		Types: []string{"public_channel", "private_channel", "mpim", "im"},
		Limit: 1000,
	})
	if err != nil {
		return nil, err
	}
	var rtn []provider.ChannelInfo
	for _, channel := range resp {
		rtn = append(rtn, provider.ChannelInfo{
			Provider: chatdb.ProviderSlack,
			ID:       channel.ID,
			Name:     channel.Name,
		})
	}
	return &provider.ListChannelsResponse{Channels: rtn}, nil
}

// GetUser returns a user by ID.
//
//encore:api private method=GET path=/slack/users/:userID
func (s *Service) GetUser(ctx context.Context, userID string) (*provider.User, error) {
	if strings.HasPrefix(userID, "B") {
		return nil, nil
	}
	user, err := s.client.GetUserInfo(userID)
	if err != nil {
		return nil, errors.Wrapf(err, "get user info: %s", userID)
	}
	name := user.Name
	if user.Profile.DisplayName != "" {
		name = user.Profile.DisplayName
	}
	return &provider.User{
		ID:      userID,
		Name:    name,
		Profile: user.Profile.Title,
	}, nil
}

type Message struct {
	slack.Msg
	Blocks json.RawMessage `json:"blocks"`
}

// LeaveChannel leaves a slack channel.
//
//encore:api private method=POST path=/slack/channels/:channelID/leave
func (s *Service) LeaveChannel(ctx context.Context, channelID string, bot *botdb.Bot) error {
	_, err := s.client.LeaveConversationContext(ctx, channelID)
	if err != nil {
		return errors.Wrap(err, "leave conversation")
	}
	return nil
}

// JoinChannel joins a slack channel.
//
//encore:api private method=POST path=/slack/channels/:channelID/join
func (s *Service) JoinChannel(ctx context.Context, channelID string, bot *botdb.Bot) error {
	_, _, _, err := s.client.JoinConversationContext(ctx, channelID)
	return errors.Wrap(err, "join conversation")
}

// ChannelInfo returns information about a slack channel.
//
//encore:api private method=GET path=/slack/channels/:channelID
func (s *Service) ChannelInfo(ctx context.Context, channelID string) (provider.ChannelInfo, error) {
	resp, err := s.client.GetConversationInfoContext(ctx, &slack.GetConversationInfoInput{
		ChannelID: channelID,
	})
	if err != nil {
		return provider.ChannelInfo{}, err
	}
	return provider.ChannelInfo{
		Provider: chatdb.ProviderSlack,
		ID:       channelID,
		Name:     resp.Name,
	}, nil
}

// SendMessage sends a message to a slack channel.
//
//encore:api private method=POST path=/slack/channels/:channelID/messages
func (s *Service) SendMessage(ctx context.Context, channelID string, req *provider.SendMessageRequest) error {
	avatar := req.Bot.GetAvatarURL()
	_, _, err := s.client.PostMessageContext(
		ctx,
		channelID,
		slack.MsgOptionMetadata(slack.SlackMetadata{
			EventType: BotMessageEventType,
			EventPayload: map[string]interface{}{
				BotIDPayload: req.Bot.ID,
			},
		}),
		slack.MsgOptionUsername(req.Bot.Name),
		slack.MsgOptionText(req.Content, false),
		slack.MsgOptionIconURL(avatar))
	return errors.Wrap(err, "post message")
}

// ListMessages returns a list of messages in a slack channel.
//
//encore:api private method=GET path=/slack/channels/:channelID/messages
func (s *Service) ListMessages(ctx context.Context, channelID string, req *provider.ListMessagesRequest) (*provider.ListMessagesResponse, error) {
	resp, err := s.client.GetConversationHistoryContext(ctx, &slack.GetConversationHistoryParameters{
		ChannelID: channelID,
		Oldest:    req.FromTimestamp,
		Limit:     100,
	})
	if err != nil {
		return nil, err
	}
	var rtn []*provider.Message
	for i := len(resp.Messages) - 1; i >= 0; i-- {
		msg := s.toProviderMessage(resp.Messages[i].Msg, channelID)
		if msg == nil {
			continue
		}
		rtn = append(rtn, msg)
	}
	return &provider.ListMessagesResponse{Messages: rtn}, nil
}

// toProviderMessage converts a slack message to a provider message.
func (svc *Service) toProviderMessage(msg slack.Msg, channel provider.ChannelID) *provider.Message {
	if msg.Text == "" || msg.Type != "message" || msg.Hidden ||
		!slices.Contains([]string{"", "bot_message"}, msg.SubType) {
		return nil
	}
	author := provider.User{
		ID:   msg.User,
		Name: msg.Username,
	}
	if msg.SubType == "bot_message" {
		var err error
		author.ID = msg.BotID + ":" + msg.Username
		if msg.Metadata.EventType == BotMessageEventType {
			botID, hasID := msg.Metadata.EventPayload[BotIDPayload]
			if botIDStr, ok := botID.(string); hasID && ok {
				author.ID = fmt.Sprintf("B-%s", botIDStr)
				author.BotID, err = uuid.FromString(botIDStr)
				if err != nil {
					rlog.Warn("invalid bot id", "id", botIDStr)
				}
			}
		}
	}
	ts, _ := strconv.ParseFloat(msg.Timestamp, 64)
	return &provider.Message{
		Provider:   chatdb.ProviderSlack,
		ProviderID: msg.ClientMsgID,
		ChannelID:  channel,
		Author:     author,
		Content:    msg.Text,
		Time:       time.UnixMicro(int64(ts * 1e6)).UTC(),
	}
}
