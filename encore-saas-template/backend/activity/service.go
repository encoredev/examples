package activity

import (
	"time"

	"encore.app/backend/user"
	"encore.dev/pubsub"
	"encore.dev/storage/sqldb"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Activity struct {
	ID        string    `gorm:"primaryKey;type:text" json:"id"`
	UserID    string    `gorm:"not null;type:text" json:"user_id"`
	Event     string    `gorm:"not null;type:text" json:"event"`
	CreatedAt time.Time `gorm:"not null;type:timestamp" json:"created_at"`
}

//encore:service
type Service struct {
	db *gorm.DB
}

var db = sqldb.NewDatabase("activities", sqldb.DatabaseConfig{
	Migrations: "./migrations",
})

func initService() (*Service, error) {
	db, err := gorm.Open(postgres.New(postgres.Config{
		Conn: db.Stdlib(),
	}))
	if err != nil {
		return nil, err
	}
	return &Service{db: db}, nil
}

var _ = pubsub.NewSubscription(
	user.Signups, "signups",
	pubsub.SubscriptionConfig[*user.SignupEvent]{
		Handler: pubsub.MethodHandler((*Service).HandleSignupEvents),
	},
)
