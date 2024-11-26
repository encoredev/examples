package auth

import (
	"context"
	"encoding/json"
	"net/http"
	"net/url"

	"encore.dev/beta/auth"
	"encore.dev/beta/errs"
	"encore.dev/config"
	"github.com/auth0/go-jwt-middleware/v2/jwks"
	"github.com/auth0/go-jwt-middleware/v2/validator"
)

type Auth0Config struct {
	Domain   config.String
	Audience config.String
}

var cfg = config.Load[*Auth0Config]()

// Service struct definition.
// Learn more: encore.dev/docs/go/primitives/service-structs
//
//encore:service
type Service struct {
	validator *validator.Validator
}

// initService is automatically called by Encore when the service starts up.
func initService() (*Service, error) {
	issuerURL, err := url.Parse("https://" + cfg.Domain() + "/")
	if err != nil {
		return nil, err
	}

	provider := jwks.NewProvider(issuerURL)

	jwtValidator, err := validator.New(
		provider.KeyFunc,
		validator.RS256,
		issuerURL.String(),
		[]string{cfg.Audience()},
	)
	if err != nil {
		return nil, err
	}

	return &Service{validator: jwtValidator}, nil
}

type UserData struct {
	Email   string `json:"email"`
	Picture string `json:"picture"`
	Sub     string `json:"sub"`
}

// The `encore:authhandler` annotation tells Encore to run this function for all
// incoming API call that requires authentication.
// Learn more: encore.dev/docs/go/develop/auth#the-auth-handler
//
//encore:authhandler
func (s *Service) AuthHandler(ctx context.Context, token string) (auth.UID, *UserData, error) {
	_, err := s.validator.ValidateToken(ctx, token)
	if err != nil {
		return "", nil, &errs.Error{
			Code:    errs.Unauthenticated,
			Message: "invalid token",
		}
	}

	userData, err := getUserInfo(token)
	if err != nil {
		return "", nil, &errs.Error{
			Code:    errs.Internal,
			Message: err.Error(),
		}
	}

	return auth.UID(userData.Sub), userData, nil
}

func getUserInfo(token string) (*UserData, error) {
	req, err := http.NewRequest("GET", "https://"+cfg.Domain()+"/userinfo", nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", "Bearer "+token)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var userData *UserData
	if err := json.NewDecoder(resp.Body).Decode(&userData); err != nil {
		return nil, err
	}

	return userData, nil
}
