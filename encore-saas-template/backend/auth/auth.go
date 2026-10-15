package auth

import (
	"context"

	"encore.dev/beta/auth"
	firebase "firebase.google.com/go/v4"
	fbauth "firebase.google.com/go/v4/auth"
	"go4.org/syncutil"
	"google.golang.org/api/option"
)

// Data represents the user's data stored in Firebase Auth.
type UserData struct {
	Email   string
	Name    string
	Picture string
	Role    string
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
	role, _ := tok.Claims["role"].(string)
	uid := auth.UID(tok.UID)

	usr := &UserData{
		Email:   email,
		Name:    name,
		Picture: picture,
		Role:    role,
	}
	return uid, usr, nil
}

var (
	fbAuth    *fbauth.Client
	setupOnce syncutil.Once
)

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

// Update user in firebase
func UpdateUser(ctx context.Context, uid string, email *string, password *string) error {
	if err := setupFB(); err != nil {
		return err
	}

	params := (&fbauth.UserToUpdate{})

	if email != nil {
		params.Email(*email)
	}
	if password != nil {
		params.Password(*password)
	}

	_, err := fbAuth.UpdateUser(ctx, uid, params)
	return err
}

var secrets struct {
	// FirebasePrivateKey is the JSON credentials for calling Firebase.
	FirebasePrivateKey string
}
