package auth

import (
	"context"

	"encore.dev/beta/auth"
	"encore.dev/beta/errs"
	"github.com/clerk/clerk-sdk-go/v2/jwt"
	"github.com/clerk/clerk-sdk-go/v2/user"

	"github.com/clerk/clerk-sdk-go/v2"
)

var secrets struct {
	ClientSecretKey string
}

// Service struct definition.
// Learn more: encore.dev/docs/primitives/services-and-apis/service-structs
//
//encore:service
type Service struct {
}

// initService is automatically called by Encore when the service starts up.
func initService() (*Service, error) {
	clerk.SetKey(secrets.ClientSecretKey)
	return &Service{}, nil
}

type UserData struct {
	ID                    string                `json:"id"`
	Username              *string               `json:"username"`
	FirstName             *string               `json:"first_name"`
	LastName              *string               `json:"last_name"`
	ProfileImageURL       *string               `json:"profile_image_url"`
	PrimaryEmailAddressID *string               `json:"primary_email_address_id"`
	EmailAddresses        []*clerk.EmailAddress `json:"email_addresses"`
}

// The `encore:authhandler` annotation tells Encore to run this function for all
// incoming API call that requires authentication.
// Learn more: encore.dev/docs/go/develop/auth#the-auth-handler
//
//encore:authhandler
func (s *Service) AuthHandler(ctx context.Context, token string) (auth.UID, *UserData, error) {
	// verify the session
	sessClaims, err := jwt.Verify(ctx, &jwt.VerifyParams{
		Token: token,
	})

	if err != nil {
		return "", nil, &errs.Error{
			Code:    errs.Unauthenticated,
			Message: "invalid token",
		}
	}

	usr, err := user.Get(ctx, sessClaims.Subject)
	if err != nil {
		return "", nil, &errs.Error{
			Code:    errs.Internal,
			Message: err.Error(),
		}
	}

	userData := &UserData{
		ID:                    usr.ID,
		Username:              usr.Username,
		FirstName:             usr.FirstName,
		LastName:              usr.LastName,
		ProfileImageURL:       usr.ImageURL,
		PrimaryEmailAddressID: usr.PrimaryEmailAddressID,
		EmailAddresses:        usr.EmailAddresses,
	}

	return auth.UID(usr.ID), userData, nil
}
