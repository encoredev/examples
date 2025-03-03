package auth

import (
	"context"
	"strings"

	"encore.dev/beta/auth"
	"encore.dev/beta/errs"
	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/clerk/clerk-sdk-go/v2/jwt"
	"github.com/clerk/clerk-sdk-go/v2/user"
)

var secrets struct {
	ClerkSecretKey string
}

type UserData struct {
	ID           string  `json:"id"`
	Username     *string `json:"username"`
	FirstName    *string `json:"first_name"`
	LastName     *string `json:"last_name"`
	ImageURL     *string `json:"image_url"`
	EmailAddress *string `json:"email_address"`
}

// The `encore:authhandler` annotation tells Encore to run this function for all
// incoming API call that requires authentication.
// Learn more: encore.dev/docs/go/develop/auth#the-auth-handler
//
//encore:authhandler
func AuthHandler(ctx context.Context, token string) (auth.UID, *UserData, error) {
	clerk.SetKey(secrets.ClerkSecretKey)

	sessionToken := strings.TrimPrefix(token, "Bearer ")

	claims, err := jwt.Verify(ctx, &jwt.VerifyParams{
		Token: sessionToken,
	})
	if err != nil {
		return "", nil, &errs.Error{
			Code:    errs.Unauthenticated,
			Message: "invalid token",
		}
	}

	usr, err := user.Get(ctx, claims.Subject)
	if err != nil {
		return "", nil, &errs.Error{
			Code:    errs.Unauthenticated,
			Message: "could not fetch user",
		}
	}

	var emailAddress *string
	if usr.PrimaryEmailAddressID != nil {
		for _, email := range usr.EmailAddresses {
			if email.ID == *usr.PrimaryEmailAddressID {
				emailAddress = &email.EmailAddress
				break
			}
		}
	}

	userData := &UserData{
		ID:           usr.ID,
		Username:     usr.Username,
		FirstName:    usr.FirstName,
		LastName:     usr.LastName,
		ImageURL:     usr.ImageURL,
		EmailAddress: emailAddress,
	}

	return auth.UID(usr.ID), userData, nil
}
