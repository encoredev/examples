package usr

import (
	"context"
	"fmt"

	"encore.dev/beta/errs"
)

// CreateUserParams are the parameters to create a user, this cannot use the ent generated types and must use custom
// struct types for Encore static analysis to work.
type CreateUserParams struct {
	Age  int
	Name string
}

type Response struct {
	Message string
}

// CreateUser is a CRUD endpoint on this service used to create users in the database.
//
//encore:api public method=POST path=/users
func CreateUser(ctx context.Context, params *CreateUserParams) (*Response, error) {
	client, err := Get()
	if err != nil {
		return nil, &errs.Error{
			Code:    errs.Internal,
			Message: "Database connection is closed",
		}
	}

	created, err := client.User.
		Create().
		SetAge(params.Age).
		SetName(params.Name).
		Save(ctx)
	if err != nil {
		return nil, &errs.Error{
			Code:    errs.InvalidArgument,
			Message: "Could not create user",
		}
	}

	return &Response{Message: fmt.Sprintf("Fetch this user with %d", created.ID)}, nil
}

// GetUserResponse like CreateUserParams needs to be a custom struct, we can't use the ent types as return
// types since they can't be easily marshaled.
type GetUserResponse struct {
	ID   int
	Age  int
	Name string
}

// GetUser is a CRUD endpoint on this service used to fetch a user from the database using the given ID.
//
//encore:api public path=/users/:id
func GetUser(ctx context.Context, id int) (*GetUserResponse, error) {
	client, err := Get()
	if err != nil {
		return nil, &errs.Error{
			Code:    errs.Internal,
			Message: "Database connection is closed",
		}
	}

	user, err := client.User.
		Get(ctx, id)
	if err != nil {
		return nil, &errs.Error{
			Code:    errs.NotFound,
			Message: "Could not find user",
		}
	}

	return &GetUserResponse{
		ID:   user.ID,
		Name: user.Name,
		Age:  user.Age,
	}, nil
}
