package api

import (
	"context"
	"fmt"

	"encore.dev/beta/auth"
	"encore.dev/beta/errs"
)

//encore:api auth path=/api/hello
func Api(ctx context.Context) (*Response, error) {
	userId, hasUserId := auth.UserID()

	if !hasUserId {
		return nil, &errs.Error{
			Code:    errs.Internal,
			Message: "User ID not found",
		}
	}

	msg := fmt.Sprintf("Hello, %s!", userId)

	return &Response{Message: msg}, nil
}

type Response struct {
	Message string
}
