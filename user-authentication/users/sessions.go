package users

import (
	"context"

	"encore.dev/beta/errs"
	"encore.dev/storage/sqldb"
	"golang.org/x/crypto/bcrypt"
)

type NewSessionParams struct {
	Username string
	Password string
}

//encore:api public
func Login(ctx context.Context, params *NewSessionParams) (*User, error) {
	eb := errs.B().Meta("params", params)

	if params == nil {
		return nil, eb.Code(errs.InvalidArgument).Msg("no params provided").Err()
	}

	var hashedPassword string

	user := User{}
	err := sqldb.QueryRow(ctx, `
		SELECT id, username, password, admin, api_key
		FROM users
		WHERE username = $1
	`, params.Username).Scan(&user.Id, &user.Username, &hashedPassword, &user.Admin, &user.ApiKey)
	if err != nil {
		return nil, eb.Code(errs.InvalidArgument).Msg("bad login").Err()
	}

	// check password matches
	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(params.Password))
	if err != nil {
		return nil, eb.Code(errs.InvalidArgument).Msg("bad login").Err()
	}

	return &user, nil
}
