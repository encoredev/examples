package auth

import (
	"context"

	"encore.dev/beta/auth"
)

var secrets struct {
	ClerkSecretKey string
}

type UserData struct {
	ID                    string  `json:"id"`
	Username              *string `json:"username"`
	FirstName             *string `json:"first_name"`
	LastName              *string `json:"last_name"`
	ImageURL              *string `json:"image_url"`
	PrimaryEmailAddressID *string `json:"primary_email_address_id"`
	// EmailAddresses        []*clerk.EmailAddress `json:"email_addresses"`
}

// The `encore:authhandler` annotation tells Encore to run this function for all
// incoming API call that requires authentication.
// Learn more: encore.dev/docs/go/develop/auth#the-auth-handler
//
//encore:authhandler
func AuthHandler(ctx context.Context, token string) (auth.UID, *UserData, error) {
	return "user-id", &UserData{}, nil
	/*
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

	   	userData := &UserData{
	   		ID:                    usr.ID,
	   		Username:              usr.Username,
	   		FirstName:             usr.FirstName,
	   		LastName:              usr.LastName,
	   		ImageURL:              usr.ImageURL,
	   		PrimaryEmailAddressID: usr.PrimaryEmailAddressID,
	   		EmailAddresses:        usr.EmailAddresses,
	   	}

	   return auth.UID(usr.ID), userData, nil
	*/
}
