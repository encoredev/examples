package auth

import (
	"context"
	"encore.dev/beta/auth"
	firebase "firebase.google.com/go/v4"
	fbauth "firebase.google.com/go/v4/auth"
	"go4.org/syncutil"
	"google.golang.org/api/option"
)

var secrets struct {
	// FirebasePrivateKey is the JSON credentials for calling Firebase.
	FirebasePrivateKey string
}

var (
	fbAuth    *fbauth.Client
	setupOnce syncutil.Once
)

// Data represents the user's data stored in Firebase Auth.
type UserData struct {
	// Email is the user's email.
	Email string
	// Name is the user's name.
	Name string
	// Picture is the user's picture URL.
	Picture string
}

// ValidateToken validates an auth token against Firebase Auth.
//
//encore:authhandler
func ValidateToken(ctx context.Context, token string) (auth.UID, *UserData, error) {
	if err := setupFB(); err != nil {
		return "", nil, err
	}
	tok, err := fbAuth.VerifyIDToken(ctx, token)
	if err != nil {
		return "", nil, err
	}

	email, _ := tok.Claims["email"].(string)
	name, _ := tok.Claims["name"].(string)
	picture, _ := tok.Claims["picture"].(string)
	uid := auth.UID(tok.UID)

	usr := &UserData{
		Email:   email,
		Name:    name,
		Picture: picture,
	}
	return uid, usr, nil
}

// setupFB ensures Firebase Auth is setup.
func setupFB() error {
	return setupOnce.Do(func() error {
		opt := option.WithCredentialsJSON([]byte(secrets.FirebasePrivateKey))
		app, err := firebase.NewApp(context.Background(), nil, opt)
		if err == nil {
			fbAuth, err = app.Auth(context.Background())
		}
		return err
	})
}
