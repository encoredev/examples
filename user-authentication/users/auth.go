package users

import (
	"context"
	"strconv"

	"encore.dev/beta/auth"
	"encore.dev/beta/errs"
	"encore.dev/middleware"
)

//encore:authhandler
func UserAuthHandler(ctx context.Context, token string) (auth.UID, *User, error) {
	user, err := GetAccountFromApiKey(ctx, token)
	if err != nil {
		return "", nil, &errs.Error{
			Code:    errs.Unauthenticated,
			Message: "invalid token",
		}
	}

	return auth.UID(strconv.Itoa(user.Id)), user, nil
}

//encore:middleware target=tag:admin
func AdminMiddleware(req middleware.Request, next middleware.Next) middleware.Response {
	if data := auth.Data().(*User); data == nil || data.Admin == false {
		return middleware.Response{
			Err: &errs.Error{
				Code:    errs.Unauthenticated,
				Message: "unauthorized",
			},
		}
	}

	return next(req)
}
