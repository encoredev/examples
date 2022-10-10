package users

import (
	"context"
	"encore.app/api_keys"
	"encore.dev/beta/errs"
	"encore.dev/storage/sqldb"
	"golang.org/x/crypto/bcrypt"
)

type CreateAccountParams struct {
	Username string
	Password string
	Admin    bool
}

//encore:api public
func Register(ctx context.Context, params *CreateAccountParams) (*User, error) {
	eb := errs.B().Meta("params", params)

	if params == nil {
		return nil, eb.Code(errs.InvalidArgument).Msg("no params provided").Err()
	}

	apiKey := api_keys.Create()
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(params.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, eb.Code(errs.Unavailable).Msg("failed to encrypt password").Err()
	}

	var id int
	err = sqldb.QueryRow(ctx, `
		INSERT INTO users (username, password, admin, api_key)
		VALUES ($1, $2, $3, $4)
		RETURNING id
	`, params.Username, hashedPassword, params.Admin, apiKey).Scan(&id)
	if err != nil {
		return nil, eb.Code(errs.Unknown).Cause(err).Msg("failed to insert user").Err()
	}

	return &User{
		Id:       id,
		Username: params.Username,
		Admin:    params.Admin,
		ApiKey:   apiKey,
	}, nil
}

func GetAccountFromApiKey(ctx context.Context, apiKey string) (*User, error) {
	eb := errs.B().Meta("key", apiKey)

	if apiKey == "" {
		return nil, eb.Code(errs.InvalidArgument).Msg("no api key provided").Err()
	}

	user := User{ApiKey: apiKey}
	if err := sqldb.QueryRow(ctx, `SELECT id, username, admin FROM users WHERE api_key = $1`, apiKey).Scan(&user.Id, &user.Username, &user.Admin); err != nil {
		return nil, eb.Code(errs.Unknown).Msg("api key not valid").Err()
	}

	return &user, nil
}
