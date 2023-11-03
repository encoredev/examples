package auth

import (
	"context"
	"encore.dev/beta/auth"
	"encore.dev/beta/errs"
	"github.com/coreos/go-oidc/v3/oidc"
	"net/url"
)

//encore:service
type Service struct {
	auth *Authenticator
}

func initService() (*Service, error) {
	authenticator, err := New()
	if err != nil {
		return nil, err
	}
	return &Service{auth: authenticator}, nil
}

type LoginResponse struct {
	State       string `json:"state"`
	AuthCodeURL string `json:"auth_code_url"`
}

//encore:api public method=POST path=/auth/login
func (s *Service) Login(ctx context.Context) (*LoginResponse, error) {
	state, err := generateRandomState()
	if err != nil {
		return nil, &errs.Error{
			Code:    errs.Internal,
			Message: err.Error(),
		}
	}

	return &LoginResponse{
		State: state,
		// add the audience to the auth code url
		AuthCodeURL: s.auth.AuthCodeURL(state),
	}, nil
}

type CallbackRequest struct {
	Code string `json:"code"`
}

type CallbackResponse struct {
	Token string `json:"token"`
}

//encore:api public method=POST path=/auth/callback
func (s *Service) Callback(ctx context.Context, req *CallbackRequest) (*CallbackResponse, error) {

	// Exchange an authorization code for a token.
	token, err := s.auth.Exchange(ctx, req.Code)
	if err != nil {
		return nil, &errs.Error{
			Code:    errs.PermissionDenied,
			Message: "Failed to convert an authorization code into a token.",
		}
	}

	idToken, err := s.auth.VerifyIDToken(ctx, token)
	if err != nil {
		return nil, &errs.Error{
			Code:    errs.Internal,
			Message: "Failed to verify ID Token.",
		}
	}

	var profile map[string]interface{}
	if err := idToken.Claims(&profile); err != nil {
		return nil, &errs.Error{
			Code:    errs.Internal,
			Message: err.Error(),
		}
	}

	return &CallbackResponse{
		Token: token.Extra("id_token").(string),
	}, nil
}

type LogoutResponse struct {
	RedirectURL string `json:"redirect_url"`
}

//encore:api public method=GET path=/auth/logout
func (s *Service) Logout(ctx context.Context) (*LogoutResponse, error) {
	logoutUrl, err := url.Parse("https://" + cfg.Domain() + "/v2/logout")
	if err != nil {
		return nil, &errs.Error{
			Code:    errs.Internal,
			Message: err.Error(),
		}
	}

	returnTo, err := url.Parse("http://localhost:3000")
	if err != nil {
		return nil, &errs.Error{
			Code:    errs.Internal,
			Message: err.Error(),
		}
	}

	parameters := url.Values{}
	parameters.Add("returnTo", returnTo.String())
	parameters.Add("client_id", cfg.ClientID())
	logoutUrl.RawQuery = parameters.Encode()

	return &LogoutResponse{
		RedirectURL: logoutUrl.String(),
	}, nil
}

//encore:authhandler
func (s *Service) AuthHandler(ctx context.Context, token string) (auth.UID, error) {
	oidcConfig := &oidc.Config{
		ClientID: s.auth.ClientID,
	}

	t, err := s.auth.Verifier(oidcConfig).Verify(ctx, token)
	if err != nil {
		return "", &errs.Error{
			Code:    errs.Unauthenticated,
			Message: "invalid token",
		}
	}

	var profile map[string]interface{}
	if err := t.Claims(&profile); err != nil {
		return "", &errs.Error{
			Code:    errs.Internal,
			Message: err.Error(),
		}
	}

	return auth.UID(profile["sub"].(string)), nil
}
