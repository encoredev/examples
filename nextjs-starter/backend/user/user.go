// Service user is an example implementation of an Encore service.
package user

import (
	"context"
	"fmt"
)

type User struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

var userMap = map[string]string{
	"1": "Alice",
	"2": "Bob",
	"3": "Caroline",
	"4": "Dave",
}

//encore:api public method=GET path=/users
func ListUsers(ctx context.Context) (*ListResponse, error) {
	var users []User
	for k, v := range userMap {
		users = append(users, User{ID: k, Name: v})
	}
	return &ListResponse{Users: users}, nil
}

type ListResponse struct {
	Users []User `json:"users"`
}

// This defines a public endpoint that requires authentication
// Learn more: https://encore.dev/docs/go/primitives/defining-apis#access-controls
//
//encore:api auth method=GET path=/users/:id
func GetUser(ctx context.Context, id string) (*UserResponse, error) {
	if v, ok := userMap[id]; ok {
		return &UserResponse{User: User{ID: id, Name: v}}, nil
	}
	return nil, fmt.Errorf("user with id %s not found", id)
}

type UserResponse struct {
	User User `json:"user"`
}
