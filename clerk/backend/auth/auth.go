package auth

import (
	"context"
	"encore.dev/beta/auth"
	"encore.dev/beta/errs"
	"github.com/clerkinc/clerk-sdk-go/clerk"
)

var secrets struct {
	ClientSecretKey string
}

// Service struct definition.
// Learn more: encore.dev/docs/primitives/services-and-apis/service-structs
//
//encore:service
type Service struct {
	client clerk.Client
}

// initService is automatically called by Encore when the service starts up.
func initService() (*Service, error) {
	client, err := clerk.NewClient(secrets.ClientSecretKey)
	if err != nil {
		return nil, err
	}
	return &Service{client: client}, nil
}

type UserData struct {
	ID                    string               `json:"id"`
	Username              *string              `json:"username"`
	FirstName             *string              `json:"first_name"`
	LastName              *string              `json:"last_name"`
	ProfileImageURL       string               `json:"profile_image_url"`
	PrimaryEmailAddressID *string              `json:"primary_email_address_id"`
	EmailAddresses        []clerk.EmailAddress `json:"email_addresses"`
}

// The `encore:authhandler` annotation tells Encore to run this function for all
// incoming API call that requires authentication.
// Learn more: encore.dev/docs/develop/auth#the-auth-handler
//
//encore:authhandler
func (s *Service) AuthHandler(ctx context.Context, token string) (auth.UID, *UserData, error) {
	// verify the session
	sessClaims, err := s.client.VerifyToken(token)
	if err != nil {
		return "", nil, &errs.Error{
			Code:    errs.Unauthenticated,
			Message: "invalid token",
		}
	}

	user, err := s.client.Users().Read(sessClaims.Claims.Subject)
	if err != nil {
		return "", nil, &errs.Error{
			Code:    errs.Internal,
			Message: err.Error(),
		}
	}

	userData := &UserData{
		ID:                    user.ID,
		Username:              user.Username,
		FirstName:             user.FirstName,
		LastName:              user.LastName,
		ProfileImageURL:       user.ProfileImageURL,
		PrimaryEmailAddressID: user.PrimaryEmailAddressID,
		EmailAddresses:        user.EmailAddresses,
	}

	return auth.UID(user.ID), userData, nil
}
