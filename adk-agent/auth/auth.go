// Package auth checks bearer API keys.
package auth

import (
	"context"
	"crypto/subtle"
	"encoding/json"
	"errors"
	"sync"

	"encore.dev/beta/auth"
	"encore.dev/beta/errs"
	"encore.dev/rlog"
)

var secrets struct {
	// APIKeys is a JSON object mapping user IDs to API keys, e.g. {"alice":"<key>"}.
	APIKeys string
}

// keys parses APIKeys once into a key to user map. Empty or duplicate keys are rejected.
var keys = sync.OnceValues(func() (map[string]string, error) {
	var users map[string]string
	if err := json.Unmarshal([]byte(secrets.APIKeys), &users); err != nil {
		return nil, err
	}
	out := make(map[string]string, len(users))
	for user, key := range users {
		if key == "" {
			return nil, errors.New("empty key for " + user)
		}
		if _, dup := out[key]; dup {
			return nil, errors.New("duplicate key")
		}
		out[key] = user
	}
	return out, nil
})

// AuthHandler accepts "Authorization: Bearer <key>" and returns the user the key belongs to.
//
//encore:authhandler
func AuthHandler(ctx context.Context, token string) (auth.UID, error) {
	m, err := keys()
	if err != nil {
		rlog.Error("invalid APIKeys secret", "err", err)
		return "", &errs.Error{Code: errs.Internal, Message: "invalid APIKeys secret"}
	}
	for key, user := range m {
		if subtle.ConstantTimeCompare([]byte(token), []byte(key)) == 1 {
			return auth.UID(user), nil
		}
	}
	return "", &errs.Error{Code: errs.Unauthenticated, Message: "invalid API key"}
}
