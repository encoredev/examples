package pexels

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
)

var secrets struct {
	PexelsApiKey string
}

// Object that mirrors the response from the Pexels API.
type SearchResponse struct {
	Photos []struct {
		Id  int `json:"id"`
		Src struct {
			Medium    string `json:"medium"`
			Landscape string `json:"landscape"`
		} `json:"src"`
		Alt string `json:"alt"`
	} `json:"photos"`
}

//encore:api public method=GET path=/images/:query
func SearchPhoto(ctx context.Context, query string) (*SearchResponse, error) {
	// Create a new http client to proxy the request to the Pexels API.
	URL := "https://api.pexels.com/v1/search?query=" + query
	client := &http.Client{}
	req, _ := http.NewRequest("GET", URL, nil)

	// Add authorization header to the req with the API key.
	req.Header.Set("Authorization", secrets.PexelsApiKey)

	// Make the request, and close the response body when we're done.
	res, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	if res.StatusCode >= 400 {
		return nil, fmt.Errorf("Pexels API error: %s", res.Status)
	}

	// Decode the data into the searchResponse struct.
	var searchResponse *SearchResponse
	err = json.NewDecoder(res.Body).Decode(&searchResponse)
	if err != nil {
		return nil, err
	}

	return searchResponse, nil
}
