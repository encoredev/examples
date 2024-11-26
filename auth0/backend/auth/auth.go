package auth

import (
	"context"
	"net/url"

	"encore.dev/beta/auth"
	"encore.dev/beta/errs"
	"github.com/coreos/go-oidc/v3/oidc"
)

// Service struct definition.
// Learn more: encore.dev/docs/go/primitives/service-structs
//
//encore:service
type Service struct {
	auth *Authenticator
}

// initService is automatically called by Encore when the service starts up.
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
func (s *Service) Callback(
	ctx context.Context,
	req *CallbackRequest,
) (*CallbackResponse, error) {

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

	returnTo, err := url.Parse(cfg.LogoutURL())
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

type ProfileData struct {
	Email   string `json:"email"`
	Picture string `json:"picture"`
}

// The `encore:authhandler` annotation tells Encore to run this function for all
// incoming API call that requires authentication.
// Learn more: encore.dev/docs/go/develop/auth#the-auth-handler
//
//encore:authhandler
func (s *Service) AuthHandler(
	ctx context.Context,
	token string,
) (auth.UID, *ProfileData, error) {
	oidcConfig := &oidc.Config{
		ClientID: s.auth.ClientID,
	}

	t, err := s.auth.Verifier(oidcConfig).Verify(ctx, token)
	if err != nil {
		return "", nil, &errs.Error{
			Code:    errs.Unauthenticated,
			Message: "invalid token",
		}
	}

	var profile map[string]interface{}
	if err := t.Claims(&profile); err != nil {
		return "", nil, &errs.Error{
			Code:    errs.Internal,
			Message: err.Error(),
		}
	}

	// Extract profile data returned from the identity provider.
	// auth0.com/docs/manage-users/user-accounts/user-profiles/user-profile-structure
	profileData := &ProfileData{
		Email:   profile["email"].(string),
		Picture: profile["picture"].(string),
	}

	return auth.UID(profile["sub"].(string)), profileData, nil
}

// Endpoints annotated with `auth` are public and requires authentication
// Learn more: encore.dev/docs/go/primitives/defining-apis#access-controls
//
//encore:api auth method=GET path=/profile
func GetProfile(ctx context.Context) (*ProfileData, error) {
	return auth.Data().(*ProfileData), nil
}
