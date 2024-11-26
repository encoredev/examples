// Package pexels is used for searching and retrieving photos and videos from Pexels https://www.pexels.com/api/documentation/
package pexels

import (
	"encoding/json"
	"fmt"
	"net/http"

	"encore.dev/rlog"
)

// Authorization is required for the Pexels API. All requests you make to the API will need to include your key.
// This uses Encore's built-in secrets manager, learn more: https://encore.dev/docs/go/primitives/secrets
var secrets struct {
	PexelsApiKey string
}

func makeGetRequest(url string, result interface{}) error {
	client := &http.Client{}
	req, _ := http.NewRequest("GET", url, nil)

	// Add authorization header to the req with the API key.
	req.Header.Set("Authorization", secrets.PexelsApiKey)

	// Make the request, and close the response body when we're done.
	res, err := client.Do(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	rlog.Info("Pexels API Request Statistics",
		"Limit", res.Header.Get("X-Ratelimit-Limit"), // Your total request limit for the monthly period
		"Remaining", res.Header.Get("X-Ratelimit-Remaining"), // How many of these requests remain
		"Reset", res.Header.Get("X-Ratelimit-Reset"), //UNIX timestamp of when the currently monthly period will roll over
	)

	if res.StatusCode >= 400 {
		return fmt.Errorf("Pexels API error: %s", res.Status)
	}

	if err := json.NewDecoder(res.Body).Decode(result); err != nil {
		return err
	}

	return nil
}
