package activity

import (
	"errors"

	a "encore.app/backend/auth"
	"encore.dev/beta/auth"
	"encore.dev/beta/errs"
	"encore.dev/middleware"
)

// ValidateAdmin validates the roles of the user.
//
//encore:middleware target=tag:admin
func ValidateAdmin(req middleware.Request, next middleware.Next) middleware.Response {
	userData := auth.Data().(*a.UserData)

	if userData.Role != "admin" {
		err := errs.WrapCode(errors.New("permission denied"), errs.PermissionDenied, "user is not an admin")
		return middleware.Response{Err: err}
	}

	return next(req)
}
