package subscription

import (
	"time"

	"encore.dev/storage/sqldb"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var secrets struct {
	StripeSecretKey     string
	StripeWebhookSecret string
	CallbackURL         string
}

type Subscription struct {
	ID                    string     `gorm:"primaryKey;type:text" json:"id"`
	UserId                string     `gorm:"not null;type:text" json:"user_id"`
	StripeCustomerId      *string    `gorm:"not null;type:text" json:"stripe_customer_id"`
	StripeSubscriptionId  *string    `gorm:"not null;type:text" json:"stripe_subscription_id"`
	StripeProductId       *string    `gorm:"not null;type:text" json:"stripe_product_id"`
	PlanName              *string    `gorm:"type:text" json:"plan_name"`
	SubscriptionStatus    *string    `gorm:"not null;type:text" json:"subscription_status"`
	SubscriptionUpdatedAt time.Time  `gorm:"not null;type:timestamp" json:"subscription_updated_at"`
	CancelAtPeriodEnd     bool       `gorm:"not null;type:boolean" json:"cancel_at_period_end"`
	CancelAt              *time.Time `gorm:"type:timestamp" json:"cancel_at"`
	CreatedAt             time.Time  `gorm:"default:now()" json:"created_at"`
}

//encore:service
type Service struct {
	db *gorm.DB
}

var db = sqldb.NewDatabase("subscriptions", sqldb.DatabaseConfig{
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
