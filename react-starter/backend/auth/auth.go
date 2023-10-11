package auth

import (
	"context"
	"encore.dev/beta/auth"
	"encore.dev/beta/errs"
	"encore.dev/rlog"
)

const TOKEN = "dummy-token"

type LoginRequest struct {
	Email string `json:"email"`
}

type LoginResponse struct {
	Token string `json:"token"`
}

//encore:api public method=POST path=/auth/login
func Login(ctx context.Context, params *LoginRequest) (*LoginResponse, error) {
	// Validate the email and password, for example by calling Firebase Auth: https://encore.dev/docs/how-to/firebase-auth

	rlog.Info("User login", "email", params.Email)
	return &LoginResponse{Token: TOKEN}, nil
}

//encore:authhandler
func AuthHandler(ctx context.Context, token string) (auth.UID, error) {
	// Validate the token and look up the user id, for example by calling Firebase Auth: https://encore.dev/docs/how-to/firebase-auth

	if token != TOKEN {
		return "", &errs.Error{
			Code: errs.Unauthenticated,
		}
	}

	return "user-id", nil
}
