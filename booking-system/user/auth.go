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

//encore:authhandler
func AuthHandler(ctx context.Context, p *AuthParams) (auth.UID, *Data, error) {
	if p.Authorization != "" {
		return "test", &Data{}, nil
	}
	return "", nil, errs.B().Code(errs.Unauthenticated).Msg("no auth header").Err()
}
