// Service user authenticates users (real auth to be implemented).
package user

import (
	"context"

	"encore.dev/beta/auth"
	"encore.dev/beta/errs"
)

type Data struct {
	Email string
}

type AuthParams struct {
	Authorization string `header:"Authorization"`
}

// This annotation tells Encore to run the function whenever an incoming API call contains authentication data.
// Learn more: https://encore.dev/docs/develop/auth#the-auth-handler
//
//encore:authhandler
func AuthHandler(ctx context.Context, p *AuthParams) (auth.UID, *Data, error) {
	if p.Authorization != "" {
		return "test", &Data{}, nil
	}
	return "", nil, errs.B().Code(errs.Unauthenticated).Msg("no auth header").Err()
}
