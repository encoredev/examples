package auth

import (
	"context"
	"time"

	"encore.dev/beta/auth"
	"encore.dev/beta/errs"
	"encore.dev/config"
	"github.com/MicahParks/keyfunc/v3"
	"github.com/golang-jwt/jwt/v5"
)

// Configuration variables for authentication
type LogtoAuthConfig struct {
	// The issuer URL
	Issuer config.String
	// URL to fetch JSON Web Key Set (JWKS)
	JwksUri config.String
	// Expected audience for the JWT
	ApiResourceIndicator config.String
	// Expected client ID in the token claims
	ClientId config.String
}

var authConfig *LogtoAuthConfig = config.Load[*LogtoAuthConfig]()

// RequiredClaims defines the expected structure of JWT claims
// Extends the standard JWT claims with a custom ClientID field
type RequiredClaims struct {
	ClientID string `json:"client_id"`
	jwt.RegisteredClaims
}

// AuthHandler validates JWT tokens and extracts the user ID
// Implements Encore's authentication handler interface
//
//encore:authhandler
func AuthHandler(ctx context.Context, token string) (auth.UID, error) {
	// Fetch and parse the JWKS (JSON Web Key Set) from the identity provider
	jwks, err := keyfunc.NewDefaultCtx(ctx, []string{authConfig.JwksUri()})
	if err != nil {
		return "", &errs.Error{
			Code:    errs.Internal,
			Message: "failed to fetch JWKS",
		}
	}

	// Parse and validate the JWT token with required claims and validation options
	parsedToken, err := jwt.ParseWithClaims(
		token,
		&RequiredClaims{},
		jwks.Keyfunc,
		// Expect the token to be intended for this API resource
		jwt.WithAudience(authConfig.ApiResourceIndicator()),
		// Expect the token to be issued by this issuer
		jwt.WithIssuer(authConfig.Issuer()),
		// Allow some leeway for clock skew
		jwt.WithLeeway(time.Minute*10),
	)

	// Check if there were any errors during token parsing
	if err != nil {
		return "", &errs.Error{
			Code:    errs.Unauthenticated,
			Message: "invalid token",
		}
	}

	// Verify that the client ID in the token matches the expected client ID
	if parsedToken.Claims.(*RequiredClaims).ClientID != authConfig.ClientId() {
		return "", &errs.Error{
			Code:    errs.Unauthenticated,
			Message: "invalid token",
		}
	}

	// Extract the user ID (subject) from the token claims
	userId, err := parsedToken.Claims.GetSubject()
	if err != nil {
		return "", &errs.Error{
			Code:    errs.Unauthenticated,
			Message: "invalid token",
		}
	}

	// Return the user ID as an Encore auth.UID
	return auth.UID(userId), nil
}
