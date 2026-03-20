// Package auth provides authentication for the application.
package auth

import (
	"context"

	"encore.dev/beta/auth"
	"encore.dev/beta/errs"
)

// AuthParams defines how the auth handler receives credentials.
type AuthParams struct {
	// AuthUser is the user ID to authenticate as. Pass as ?auth_user=<user_id>.
	AuthUser string `query:"auth_user"`
}

// AuthData represents the authenticated user's data.
type AuthData struct {
	UserID string
}

// Placeholder auth handler for demo purposes.
// Reads the user ID from the `auth_user` query string parameter.
// In a real app, replace this with JWT validation, session cookies,
// or an auth provider like Clerk or Auth0.
//
//encore:authhandler
func AuthHandler(ctx context.Context, p *AuthParams) (auth.UID, *AuthData, error) {
	if p.AuthUser == "" {
		return "", nil, &errs.Error{Code: errs.Unauthenticated, Message: "missing auth_user query parameter"}
	}
	return auth.UID(p.AuthUser), &AuthData{UserID: p.AuthUser}, nil
}
