package pexels

import (
	"context"
	"fmt"
	"github.com/google/go-querystring/query"
)

type PhotoResponse struct {
	Id              int    `json:"id"`
	Width           int    `json:"width"`
	Height          int    `json:"height"`
	Url             string `json:"url"`
	Photographer    string `json:"photographer"`
	PhotographerUrl string `json:"photographer_url"`
	PhotographerId  int    `json:"photographer_id"`
	AvgColor        string `json:"avg_color"`
	Src             struct {
		Original  string `json:"original"`
		Large2X   string `json:"large2x"`
		Large     string `json:"large"`
		Medium    string `json:"medium"`
		Small     string `json:"small"`
		Portrait  string `json:"portrait"`
		Landscape string `json:"landscape"`
		Tiny      string `json:"tiny"`
	} `json:"src"`
	Liked bool   `json:"liked"`
	Alt   string `json:"alt"`
}

type PhotoSearchResponse struct {
	Page         int              `json:"page"`
	PerPage      int              `json:"per_page"`
	TotalResults int              `json:"total_results"`
	NextPage     string           `json:"next_page"`
	PrevPage     string           `json:"prev_page"`
	Photos       []*PhotoResponse `json:"photos"`
}

type PhotoQueryParams struct {
	// Default: 1
	Page int `query:"page,omitempty" url:"page,omitempty"`

	// Default: 15, Max: 80
	PerPage int `query:"per_page" url:"per_page,omitempty"`

	Query string `query:"query" url:"query,omitempty"`

	// "landscape", "portrait", "square"
	Orientation string `query:"orientation" url:"per_page,omitempty"`

	// "large" (24MP), "medium" (12MP) or "small" (4MP)
	Size string `query:"size" url:"size,omitempty"`

	// "red", "orange", "yellow", "green", "turquoise", "blue", "violet", "pink", "brown", "black", "gray", "white" or any hexidecimal color code (eg. "#ffffff").
	Color string `query:"color" url:"color,omitempty"`

	// "en-US", "pt-BR", "es-ES", "ca-ES", "de-DE", "it-IT", "fr-FR", "sv-SE", "id-ID", "pl-PL", "ja-JP", "zh-TW", "zh-CN", "ko-KR"
	// "th-TH", "nl-NL", "hu-HU", "vi-VN", "cs-CZ", "da-DK", "fi-FI", "uk-UA", "el-GR", "ro-RO", "nb-NO", "sk-SK", "tr-TR", "ru-RU"
	Locale string `query:"locale" url:"locale,omitempty"`
}

// SearchPhotos search Pexels for photos.
// Query could be something broad like "Nature", "Tigers", "People". Or it could be something specific like "Group of people working".
// https://www.pexels.com/api/documentation/#photos-search
//
//encore:api public method=GET path=/photos/search
func SearchPhotos(ctx context.Context, queryParams *PhotoQueryParams) (*PhotoSearchResponse, error) {
	if queryParams.Query == "" {
		return nil, fmt.Errorf("query string needs to contain param 'query'")
	}

	v, err := query.Values(queryParams)
	if err != nil {
		return nil, err
	}

	url := "https://api.pexels.com/v1/search?" + v.Encode()
	var searchResponse *PhotoSearchResponse
	if err = makeGetRequest(url, &searchResponse); err != nil {
		return nil, err
	}

	return searchResponse, nil
}

type CuratedParams struct {
	// Default: 1
	Page int `query:"page" url:"page,omitempty"`

	// Default: 15, Max: 80
	PerPage int `query:"per_page" url:"per_page,omitempty"`
}

// CuratedPhotos receive real-time photos curated by the Pexels team.
// https://www.pexels.com/api/documentation/#photos-curated
//
//encore:api public method=GET path=/photos/curated
func CuratedPhotos(ctx context.Context, queryParams *CuratedParams) (*PhotoSearchResponse, error) {
	v, err := query.Values(queryParams)
	if err != nil {
		return nil, err
	}

	url := "https://api.pexels.com/v1/curated?" + v.Encode()
	var searchResponse *PhotoSearchResponse
	if err = makeGetRequest(url, &searchResponse); err != nil {
		return nil, err
	}

	return searchResponse, nil
}

// GetPhoto retrieves a specific photo.
// https://www.pexels.com/api/documentation/#photos-show
//
//encore:api public method=GET path=/photo/:id
func GetPhoto(ctx context.Context, id string) (*PhotoResponse, error) {
	url := "https://api.pexels.com/v1/photos/" + id
	var searchResponse *PhotoResponse
	if err := makeGetRequest(url, &searchResponse); err != nil {
		return nil, err
	}
	return searchResponse, nil
}
