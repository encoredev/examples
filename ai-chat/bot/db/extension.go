package db

import (
	"encore.app/proxy"
)

func (bot *Bot) GetAvatarURL() string {
	return proxy.BaseURL.JoinPath("bots", bot.ID.String(), "avatar").String()
}
