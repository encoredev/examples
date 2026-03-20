// Service user manages user accounts.
package user

import (
	"context"
	"time"

	"encore.dev/beta/errs"
	"encore.dev/pubsub"
	"encore.dev/storage/sqldb"
	"github.com/google/uuid"
)

var db = sqldb.NewDatabase("user", sqldb.DatabaseConfig{
	Migrations: "./migrations",
})

// UserCreatedEvent is published when a new user is created.
type UserCreatedEvent struct {
	UserID string `json:"user_id"`
	Email  string `json:"email"`
	Name   string `json:"name"`
}

// UserCreatedTopic is the Pub/Sub topic for user creation events.
var UserCreatedTopic = pubsub.NewTopic[*UserCreatedEvent]("user-created", pubsub.TopicConfig{
	DeliveryGuarantee: pubsub.AtLeastOnce,
})

// CreateRequest is the request to create a new user.
type CreateRequest struct {
	Email string `json:"email"`
	Name  string `json:"name"`
}

// User represents a user account.
type User struct {
	ID        string `json:"id"`
	Email     string `json:"email"`
	Name      string `json:"name"`
	CreatedAt string `json:"created_at"`
}

// Create creates a new user. Publishes a UserCreated event for downstream services.
//
//encore:api public method=POST path=/users
func Create(ctx context.Context, req *CreateRequest) (*User, error) {
	id := uuid.New().String()

	_, err := db.Exec(ctx, `
		INSERT INTO users (id, email, name)
		VALUES ($1, $2, $3)
	`, id, req.Email, req.Name)
	if err != nil {
		return nil, err
	}

	if _, err := UserCreatedTopic.Publish(ctx, &UserCreatedEvent{
		UserID: id,
		Email:  req.Email,
		Name:   req.Name,
	}); err != nil {
		return nil, err
	}

	return &User{
		ID:        id,
		Email:     req.Email,
		Name:      req.Name,
		CreatedAt: time.Now().Format(time.RFC3339),
	}, nil
}

// Get gets a user by ID.
//
//encore:api public method=GET path=/users/:id
func Get(ctx context.Context, id string) (*User, error) {
	var u User
	var t time.Time
	err := db.QueryRow(ctx, `
		SELECT id, email, name, created_at
		FROM users WHERE id = $1
	`, id).Scan(&u.ID, &u.Email, &u.Name, &t)
	if err != nil {
		return nil, &errs.Error{Code: errs.NotFound, Message: "user not found"}
	}
	u.CreatedAt = t.Format(time.RFC3339)
	return &u, nil
}

// ListResponse is the response for listing users.
type ListResponse struct {
	Users []User `json:"users"`
}

// List lists all users.
//
//encore:api public method=GET path=/users
func List(ctx context.Context) (*ListResponse, error) {
	rows, err := db.Query(ctx, `
		SELECT id, email, name, created_at
		FROM users ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var u User
		var t time.Time
		if err := rows.Scan(&u.ID, &u.Email, &u.Name, &t); err != nil {
			return nil, err
		}
		u.CreatedAt = t.Format(time.RFC3339)
		users = append(users, u)
	}

	return &ListResponse{Users: users}, nil
}
