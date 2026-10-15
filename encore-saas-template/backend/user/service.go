package user

import (
	"time"

	"encore.dev/pubsub"
	"encore.dev/storage/sqldb"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var secrets struct {
	StripeSecretKey string
}

//encore:service
type Service struct {
	db *gorm.DB
}

type User struct {
	ID                string    `gorm:"primaryKey;type:text" json:"id"`
	Email             string    `gorm:"not null;type:text" json:"email"`
	DisplayName       string    `gorm:"not null;type:text" json:"display_name"`
	ProfilePictureURL string    `gorm:"not null;type:text" json:"profile_picture_url"`
	ExternalID        string    `gorm:"not null;type:text" json:"external_id"`
	StripeCustomerId  *string   `gorm:"type:text" json:"stripe_customer_id"`
	CreatedAt         time.Time `gorm:"default:now()" json:"created_at"`

	Subscription *Subscription `gorm:"foreignKey:UserID;references:ID" json:"subscription,omitempty"`
}

type Subscription struct {
	ID                    string     `gorm:"primaryKey;type:text" json:"id"`
	UserID                string     `gorm:"not null;type:text;uniqueIndex" json:"user_id"`
	StripeSubscriptionID  *string    `gorm:"type:text" json:"stripe_subscription_id"`
	StripeProductID       *string    `gorm:"type:text" json:"stripe_product_id"`
	PlanName              *string    `gorm:"type:text" json:"plan_name"`
	SubscriptionStatus    *string    `gorm:"type:text" json:"subscription_status"`
	SubscriptionUpdatedAt time.Time  `gorm:"type:timestamp" json:"subscription_updated_at"`
	IsActive              bool       `gorm:"not null;default:true" json:"is_active"`
	CanceledAt            *time.Time `gorm:"type:timestamp" json:"canceled_at"`
	CreatedAt             time.Time  `gorm:"default:now()" json:"created_at"`
}

var db = sqldb.NewDatabase("users", sqldb.DatabaseConfig{
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

type SignupEvent struct{ UserID string }

var Signups = pubsub.NewTopic[*SignupEvent]("signups", pubsub.TopicConfig{
	DeliveryGuarantee: pubsub.AtLeastOnce,
})
