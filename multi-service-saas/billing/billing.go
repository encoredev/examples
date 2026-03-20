// Service billing manages subscriptions and plan upgrades.
package billing

import (
	"context"
	"fmt"
	"time"

	"encore.app/user"
	"encore.dev/beta/auth"
	"encore.dev/beta/errs"
	"encore.dev/pubsub"
	"encore.dev/rlog"
	"encore.dev/storage/sqldb"
)

var db = sqldb.NewDatabase("billing", sqldb.DatabaseConfig{
	Migrations: "./migrations",
})

// PlanChangedEvent is published when a user's subscription plan changes.
type PlanChangedEvent struct {
	UserID  string `json:"user_id"`
	OldPlan string `json:"old_plan"`
	NewPlan string `json:"new_plan"`
}

// PlanChangedTopic is the Pub/Sub topic for plan change events.
var PlanChangedTopic = pubsub.NewTopic[*PlanChangedEvent]("plan-changed", pubsub.TopicConfig{
	DeliveryGuarantee: pubsub.AtLeastOnce,
})

// Auto-create a free plan when a new user signs up.
var _ = pubsub.NewSubscription(user.UserCreatedTopic, "create-free-plan", pubsub.SubscriptionConfig[*user.UserCreatedEvent]{
	Handler: func(ctx context.Context, event *user.UserCreatedEvent) error {
		rlog.Info("creating free plan for new user", "user_id", event.UserID)

		_, err := db.Exec(ctx, `
			INSERT INTO subscriptions (user_id, plan, status)
			VALUES ($1, 'free', 'active')
			ON CONFLICT (user_id) DO NOTHING
		`, event.UserID)
		return err
	},
})

// SubscriptionInfo represents a user's subscription.
type SubscriptionInfo struct {
	ID        int64  `json:"id"`
	UserID    string `json:"user_id"`
	Plan      string `json:"plan"`
	Status    string `json:"status"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

// Get gets billing info for the authenticated user.
//
//encore:api auth method=GET path=/billing
func Get(ctx context.Context) (*SubscriptionInfo, error) {
	uid, _ := auth.UserID()
	userID := string(uid)

	var s SubscriptionInfo
	var createdAt, updatedAt time.Time
	err := db.QueryRow(ctx, `
		SELECT id, user_id, plan, status, created_at, updated_at
		FROM subscriptions WHERE user_id = $1
	`, userID).Scan(&s.ID, &s.UserID, &s.Plan, &s.Status, &createdAt, &updatedAt)
	if err != nil {
		return nil, &errs.Error{Code: errs.NotFound, Message: "no subscription found"}
	}
	s.CreatedAt = createdAt.Format(time.RFC3339)
	s.UpdatedAt = updatedAt.Format(time.RFC3339)
	return &s, nil
}

// UpgradeRequest is the request to upgrade a subscription plan.
type UpgradeRequest struct {
	Plan string `json:"plan"`
}

// Upgrade upgrades the authenticated user's subscription plan. Options: free, pro, enterprise.
//
//encore:api auth method=POST path=/billing/upgrade
func Upgrade(ctx context.Context, req *UpgradeRequest) (*SubscriptionInfo, error) {
	uid, _ := auth.UserID()
	userID := string(uid)

	valid := map[string]bool{"free": true, "pro": true, "enterprise": true}
	if !valid[req.Plan] {
		return nil, &errs.Error{
			Code:    errs.InvalidArgument,
			Message: fmt.Sprintf("plan must be one of: free, pro, enterprise"),
		}
	}

	// Get the current plan.
	var currentPlan string
	err := db.QueryRow(ctx, `
		SELECT plan FROM subscriptions WHERE user_id = $1
	`, userID).Scan(&currentPlan)
	if err != nil {
		return nil, &errs.Error{Code: errs.NotFound, Message: "no subscription found"}
	}

	// Update the plan.
	_, err = db.Exec(ctx, `
		UPDATE subscriptions
		SET plan = $1, updated_at = NOW()
		WHERE user_id = $2
	`, req.Plan, userID)
	if err != nil {
		return nil, err
	}

	// Publish plan changed event.
	if _, err := PlanChangedTopic.Publish(ctx, &PlanChangedEvent{
		UserID:  userID,
		OldPlan: currentPlan,
		NewPlan: req.Plan,
	}); err != nil {
		return nil, err
	}

	// Return updated subscription.
	var s SubscriptionInfo
	var createdAt, updatedAt time.Time
	err = db.QueryRow(ctx, `
		SELECT id, user_id, plan, status, created_at, updated_at
		FROM subscriptions WHERE user_id = $1
	`, userID).Scan(&s.ID, &s.UserID, &s.Plan, &s.Status, &createdAt, &updatedAt)
	if err != nil {
		return nil, err
	}
	s.CreatedAt = createdAt.Format(time.RFC3339)
	s.UpdatedAt = updatedAt.Format(time.RFC3339)
	return &s, nil
}
