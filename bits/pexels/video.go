package pexels

import (
	"context"
	"fmt"
	"github.com/google/go-querystring/query"
)

type VideoResponse struct {
	Id       int      `json:"id"`
	Width    int      `json:"width"`
	Height   int      `json:"height"`
	Url      string   `json:"url"`
	Image    string   `json:"image"`
	Tags     []string `json:"tags"`
	Duration int      `json:"duration"`

	User struct {
		Id   int    `json:"id"`
		Name string `json:"name"`
		Url  string `json:"url"`
	} `json:"user"`

	VideoFiles []struct {
		Id       int     `json:"id"`
		Quality  string  `json:"quality"`
		FileType string  `json:"file_type"`
		Width    int     `json:"width"`
		Height   int     `json:"height"`
		Fps      float64 `json:"fps"`
		Link     string  `json:"link"`
	} `json:"video_files"`

	VideoPictures []struct {
		Id      int    `json:"id"`
		Picture string `json:"picture"`
		Nr      int    `json:"nr"`
	} `json:"video_pictures"`
}

type VideoSearchResponse struct {
	Page         int              `json:"page"`
	PerPage      int              `json:"per_page"`
	TotalResults int              `json:"total_results"`
	Url          string           `json:"url"`
	NextPage     string           `json:"next_page"`
	PrevPage     string           `json:"prev_page"`
	Photos       []*VideoResponse `json:"videos"`
}

type VideoQueryParams struct {
	// Default: 1
	Page int `query:"page" url:"page,omitempty"`

	// Default: 15, Max: 80
	PerPage int `query:"per_page" url:"per_page,omitempty"`

	Query string `query:"query" url:"query,omitempty"`

	// "landscape", "portrait", "square"
	Orientation string `query:"orientation" url:"per_page,omitempty"`

	// "large" (4K), "medium" (Full HD) or "small" (HD)
	Size string `query:"size" url:"size,omitempty"`

	// "en-US", "pt-BR", "es-ES", "ca-ES", "de-DE", "it-IT", "fr-FR", "sv-SE", "id-ID", "pl-PL", "ja-JP", "zh-TW", "zh-CN", "ko-KR"
	// "th-TH", "nl-NL", "hu-HU", "vi-VN", "cs-CZ", "da-DK", "fi-FI", "uk-UA", "el-GR", "ro-RO", "nb-NO", "sk-SK", "tr-TR", "ru-RU"
	Locale string `query:"locale" url:"locale,omitempty"`
}

// SearchVideos search Pexels for videos.
// Query could be something broad like "Nature", "Tigers", "People". Or it could be something specific like "Group of people working".
// https://www.pexels.com/api/documentation/#videos-search
//
//encore:api public method=GET path=/videos/search
func SearchVideos(ctx context.Context, queryParams *VideoQueryParams) (*VideoSearchResponse, error) {
	if queryParams.Query == "" {
		return nil, fmt.Errorf("query string needs to contain param 'query'")
	}

	v, err := query.Values(queryParams)
	if err != nil {
		return nil, err
	}

	url := "https://api.pexels.com/videos/search?" + v.Encode()
	var response *VideoSearchResponse
	if err = makeGetRequest(url, &response); err != nil {
		return nil, err
	}

	return response, nil
}

type VideoPopularParams struct {
	// Default: 1
	Page int `query:"page" url:"page,omitempty"`

	// Default: 15, Max: 80
	PerPage int `query:"per_page" url:"per_page,omitempty"`

	MinWidth    int `query:"min_width" url:"min_width,omitempty"`
	MinHeight   int `query:"min_height" url:"min_height,omitempty"`
	MinDuration int `query:"min_duration" url:"min_duration,omitempty"`
	MaxDuration int `query:"max_duration" url:"max_duration,omitempty"`
}

// PopularVideos receives the current popular Pexels videos.
// https://www.pexels.com/api/documentation/#videos-popular
//
//encore:api public method=GET path=/videos/popular
func PopularVideos(ctx context.Context, queryParams *VideoPopularParams) (*VideoSearchResponse, error) {
	v, err := query.Values(queryParams)
	if err != nil {
		return nil, err
	}

	url := "https://api.pexels.com/videos/popular?" + v.Encode()
	var response *VideoSearchResponse
	if err = makeGetRequest(url, &response); err != nil {
		return nil, err
	}

	return response, nil
}

// GetVideo retrieves a specific video.
// https://www.pexels.com/api/documentation/#videos-show
//
//encore:api public method=GET path=/video/:id
func GetVideo(ctx context.Context, id string) (*VideoResponse, error) {
	url := "https://api.pexels.com/videos/videos/" + id
	var response *VideoResponse
	if err := makeGetRequest(url, &response); err != nil {
		return nil, err
	}
	return response, nil
}
