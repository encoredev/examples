package user

import (
	"context"
	"errors"
	"time"

	a "encore.app/backend/auth"
	"encore.dev/beta/auth"
	"encore.dev/beta/errs"
	"encore.dev/rlog"
	"github.com/google/uuid"
	"github.com/stripe/stripe-go/v81"
	"github.com/stripe/stripe-go/v81/customer"
	"gorm.io/gorm"
)

type UserResponse struct {
	ID                string    `json:"id"`
	Email             string    `json:"email"`
	DisplayName       string    `json:"display_name"`
	ProfilePictureURL string    `json:"profile_picture_url"`
	CreatedAt         time.Time `json:"created_at"`
	StripeCustomerId  *string   `json:"stripe_customer_id"`
}

type UpdateUserRequest struct {
	DisplayName       string `json:"display_name"`
	ProfilePictureURL string `json:"profile_picture_url"`
	StripeCustomerId  string `json:"stripe_customer_id"`
	Email             string `json:"email"`
	Password          string `json:"password"`
}

type UsersResponse struct {
	Users []*UserResponse `json:"users"`
}

//encore:api auth method=POST path=/v1/users
func (s *Service) AddUser(ctx context.Context) (*UserResponse, error) {
	eb := errs.B()

	uid, _ := auth.UserID()

	// Get the user data from the auth token
	userData := auth.Data().(*a.UserData)

	user := User{
		ID:                uuid.NewString(),
		ExternalID:        string(uid),
		Email:             userData.Email,
		DisplayName:       userData.Name,
		ProfilePictureURL: userData.Picture,
	}

	if err := s.db.Create(&user).Error; err != nil {
		return nil, eb.Cause(err).Code(errs.Internal).Msg("failed to insert user").Err()
	}

	rlog.Info("user created with email", "email", user.Email)

	response := &UserResponse{
		ID:                user.ID,
		Email:             user.Email,
		DisplayName:       user.DisplayName,
		ProfilePictureURL: user.ProfilePictureURL,
		CreatedAt:         user.CreatedAt,
		StripeCustomerId:  user.StripeCustomerId,
	}

	Signups.Publish(ctx, &SignupEvent{UserID: user.ID})

	return response, nil
}

//encore:api auth method=GET path=/v1/me
func (s *Service) GetUser(ctx context.Context) (*UserResponse, error) {
	eb := errs.B()

	user, err := s.GetDbUserByToken(ctx)
	if err != nil {
		return nil, eb.Cause(err).Code(errs.NotFound).Msg("user not found").Err()
	}

	return &UserResponse{
		ID:                user.ID,
		Email:             user.Email,
		DisplayName:       user.DisplayName,
		ProfilePictureURL: user.ProfilePictureURL,
		CreatedAt:         user.CreatedAt,
		StripeCustomerId:  user.StripeCustomerId,
	}, nil
}

//encore:api auth method=GET path=/v1/users/:id
func (s *Service) GetUserById(ctx context.Context, id string) (*UserResponse, error) {
	user, err := s.GetDbUserById(ctx, id)
	if err != nil {
		return nil, err
	}

	return &UserResponse{
		ID:                user.ID,
		Email:             user.Email,
		DisplayName:       user.DisplayName,
		ProfilePictureURL: user.ProfilePictureURL,
		CreatedAt:         user.CreatedAt,
		StripeCustomerId:  user.StripeCustomerId,
	}, nil
}

type GetUsersByFilterRequest struct {
	StripeCustomerId string `json:"stripe_customer_id"`
}

//encore:api auth method=GET path=/v1/users
func (s *Service) GetUsersByFilter(ctx context.Context, p *GetUsersByFilterRequest) (*UsersResponse, error) {
	users, err := s.GetDbUserByFilter(ctx, p)
	if err != nil {
		return nil, err
	}

	response := &UsersResponse{
		Users: make([]*UserResponse, len(users)),
	}

	for i, user := range users {
		response.Users[i] = &UserResponse{
			ID:                user.ID,
			Email:             user.Email,
			DisplayName:       user.DisplayName,
			ProfilePictureURL: user.ProfilePictureURL,
			StripeCustomerId:  user.StripeCustomerId,
		}
	}

	return response, nil
}

type CreateSubscriptionRequest struct {
	SubscriptionStatus *string `json:"subscription_status"`
}

//encore:api auth method=PATCH path=/v1/users/:userID
func (s *Service) UpdateUser(ctx context.Context, userID string, p *UpdateUserRequest) (*UserResponse, error) {
	eb := errs.B().Meta("user_id", userID)

	tx := s.db.Begin()
	if tx.Error != nil {
		return nil, eb.Cause(tx.Error).Code(errs.Internal).Msg("failed to begin transaction").Err()
	}

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// Find the user
	var user User
	if err := tx.First(&user, "id = ?", userID).Error; err != nil {
		tx.Rollback()
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, eb.Code(errs.NotFound).Msg("user not found").Err()
		}
		return nil, eb.Cause(err).Code(errs.Internal).Msg("failed to find user").Err()
	}

	// Update user fields if provided
	if p.DisplayName != "" {
		user.DisplayName = p.DisplayName
	}
	if p.ProfilePictureURL != "" {
		user.ProfilePictureURL = p.ProfilePictureURL
	}
	if p.StripeCustomerId != "" {
		user.StripeCustomerId = &p.StripeCustomerId

		if p.Email != "" {
			// Update the email in stripe
			stripe.Key = secrets.StripeSecretKey
			params := &stripe.CustomerParams{
				Email: stripe.String(user.Email),
			}
			_, err := customer.Update(*user.StripeCustomerId, params)
			if err != nil {
				return nil, eb.Cause(err).Code(errs.Internal).Msg("failed to update stripe customer").Err()
			}
		}
	}

	if p.Email != "" {
		user.Email = p.Email

		err := a.UpdateUser(ctx, user.ExternalID, &p.Email, nil)
		if err != nil {
			return nil, eb.Cause(err).Code(errs.Internal).Msg("failed to update firebase user").Err()
		}
	}

	if p.Password != "" {
		err := a.UpdateUser(ctx, user.ExternalID, nil, &p.Password)
		if err != nil {
			return nil, eb.Cause(err).Code(errs.Internal).Msg("failed to update firebase user").Err()
		}
	}

	if err := tx.Save(&user).Error; err != nil {
		tx.Rollback()
		return nil, eb.Cause(err).Code(errs.Internal).Msg("failed to update user").Err()
	}

	if err := tx.Commit().Error; err != nil {
		return nil, eb.Cause(err).Code(errs.Internal).Msg("failed to commit transaction").Err()
	}

	return s.GetUser(ctx)
}

//encore:api auth method=GET path=/v1/all-users tag:admin
func (s *Service) GetAllUsers(ctx context.Context) (*UsersResponse, error) {
	users, err := s.GetAllDbUsers(ctx)
	if err != nil {
		return nil, err
	}

	response := &UsersResponse{
		Users: make([]*UserResponse, len(users)),
	}
	for i, user := range users {
		response.Users[i] = &UserResponse{
			ID:                user.ID,
			Email:             user.Email,
			DisplayName:       user.DisplayName,
			ProfilePictureURL: user.ProfilePictureURL,
			CreatedAt:         user.CreatedAt,
		}
	}

	return response, nil
}

func (s *Service) GetAllDbUsers(ctx context.Context) ([]*User, error) {
	var users []*User
	if err := s.db.WithContext(ctx).Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

func (s *Service) GetDbUserById(ctx context.Context, id string) (*User, error) {
	var user User
	if err := s.db.WithContext(ctx).
		Where("id = ?", id).
		First(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func (s *Service) GetDbUserByToken(ctx context.Context) (*User, error) {
	uid, _ := auth.UserID()

	var user User
	if err := s.db.WithContext(ctx).
		Where("external_id = ?", string(uid)).
		First(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func (s *Service) GetDbUserByFilter(ctx context.Context, p *GetUsersByFilterRequest) ([]*User, error) {
	var users []*User
	if err := s.db.WithContext(ctx).
		Where("stripe_customer_id = ?", p.StripeCustomerId).
		Find(&users).Error; err != nil {
		return nil, err
	}

	return users, nil
}

func (s *Service) GetDbUserByEmail(ctx context.Context, email string) (*User, error) {
	var user User
	if err := s.db.WithContext(ctx).
		Where("email = ?", email).
		First(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}
