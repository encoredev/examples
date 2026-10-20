package auth

import (
	"context"
	"net/url"

	"encore.dev/beta/auth"
	"encore.dev/beta/errs"
	"encore.dev/rlog"
	"github.com/coreos/go-oidc/v3/oidc"
)

// This is a service struct, learn more: https://encore.dev/docs/go/primitives/service-structs
//
//encore:service
type Service struct {
	auth *Authenticator
	// authErr is why auth is nil, usually because the Auth0 settings aren't filled in yet.
	authErr error
}

// initService is automatically called by Encore when the service starts up.
// If Auth0 can't be set up, the app still starts, and the auth endpoints
// return an error until the Auth0 settings are filled in.
func initService() (*Service, error) {
	authenticator, err := New()
	if err != nil {
		rlog.Error("could not set up Auth0, check the auth config", "error", err)
		return &Service{authErr: err}, nil
	}
	return &Service{auth: authenticator}, nil
}

// authenticator returns the Auth0 authenticator, or an error if it couldn't be
// set up when the service started.
func (s *Service) authenticator() (*Authenticator, error) {
	if s.auth == nil {
		return nil, &errs.Error{
			Code:    errs.Unavailable,
			Message: "Auth0 is not configured: " + s.authErr.Error(),
		}
	}
	return s.auth, nil
}

type LoginResponse struct {
	State       string `json:"state"`
	AuthCodeURL string `json:"auth_code_url"`
}

//encore:api public method=POST path=/auth/login
func (s *Service) Login(ctx context.Context) (*LoginResponse, error) {
	a, err := s.authenticator()
	if err != nil {
		return nil, err
	}

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
		AuthCodeURL: a.AuthCodeURL(state),
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

	a, err := s.authenticator()
	if err != nil {
		return nil, err
	}

	// Exchange an authorization code for a token.
	token, err := a.Exchange(ctx, req.Code)
	if err != nil {
		return nil, &errs.Error{
			Code:    errs.PermissionDenied,
			Message: "Failed to convert an authorization code into a token.",
		}
	}

	idToken, err := a.VerifyIDToken(ctx, token)
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

// This annotation tells Encore to run the function whenever an incoming API call contains authentication data.
// Learn more: https://encore.dev/docs/go/develop/auth#the-auth-handler
//
//encore:authhandler
func (s *Service) AuthHandler(ctx context.Context, token string) (auth.UID, error) {
	a, err := s.authenticator()
	if err != nil {
		return "", err
	}

	oidcConfig := &oidc.Config{
		ClientID: a.ClientID,
	}

	t, err := a.Verifier(oidcConfig).Verify(ctx, token)
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
