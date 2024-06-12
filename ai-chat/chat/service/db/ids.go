package db

import (
	"encore.dev/types/uuid"
)

type ChannelID = uuid.UUID
type MessageID = uuid.UUID
type BotID = uuid.UUID

var Admin = &User{
	Name:       "Admin",
	Provider:   ProviderAdmin,
	ProviderID: "admin",
	ID:         uuid.Must(uuid.FromString("00000000-0000-0000-0000-000000000000")),
}
