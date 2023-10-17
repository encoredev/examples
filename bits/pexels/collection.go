package pexels

import (
	"context"
	"encoding/json"
	"github.com/google/go-querystring/query"
	"net/http"
	"strings"
)

type CollectionResourceResponse struct {
	Id          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Private     bool   `json:"private"`
	MediaCount  int    `json:"media_count"`
	PhotosCount int    `json:"photos_count"`
	VideosCount int    `json:"videos_count"`
}

type CollectionsResponse struct {
	Page         int    `json:"page"`
	PerPage      int    `json:"per_page"`
	TotalResults int    `json:"total_results"`
	NextPage     string `json:"next_page"`
	PrevPage     string `json:"prev_page"`

	Collections []*CollectionResourceResponse `json:"collections"`
}

type CollectionParams struct {
	// Default: 1
	Page int `query:"page" url:"page,omitempty"`

	// Default: 15, Max: 80
	PerPage int `query:"per_page" url:"per_page,omitempty"`
}

// FeaturedCollections retrieves all featured collections on Pexels.
// https://www.pexels.com/api/documentation/#collections-featured
//
//encore:api public method=GET path=/collections/featured
func FeaturedCollections(ctx context.Context, queryParams *CollectionParams) (*CollectionsResponse, error) {
	v, err := query.Values(queryParams)
	if err != nil {
		return nil, err
	}

	url := "https://api.pexels.com/v1/collections/featured?" + v.Encode()
	var response *CollectionsResponse
	if err = makeGetRequest(url, &response); err != nil {
		return nil, err
	}

	return response, nil
}

// MyCollections returns all of your collections.
// https://www.pexels.com/api/documentation/#collections-all
//
//encore:api public method=GET path=/collections
func MyCollections(ctx context.Context, queryParams *CollectionParams) (*CollectionsResponse, error) {
	v, err := query.Values(queryParams)
	if err != nil {
		return nil, err
	}

	url := "https://api.pexels.com/videos/popular?" + v.Encode()
	var response *CollectionsResponse
	if err = makeGetRequest(url, &response); err != nil {
		return nil, err
	}

	return response, nil
}

type CollectionMediaParams struct {
	// Default: 1
	Page int `query:"page" url:"page,omitempty"`

	// Default: 15, Max: 80
	PerPage int `query:"per_page" url:"per_page,omitempty"`

	// "photos" or "videos"
	Type string `query:"type" url:"type,omitempty"`
}

// CollectionMedia returns all the media (photos and videos) within a single collection. You can filter to only receive
// photos or videos using the type parameter: /collection/gz8lwcj?page=2&per_page=10&type=photos
// https://www.pexels.com/api/documentation/#collections-media
//
//encore:api public raw method=GET path=/collection/:id
func CollectionMedia(w http.ResponseWriter, req *http.Request) {
	id := strings.TrimPrefix(req.URL.Path, "/collection/")
	q := req.URL.Query()

	url := "https://api.pexels.com/v1/collections/" + id + "?" + q.Encode()

	var response any
	if err := makeGetRequest(url, &response); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	data, _ := json.Marshal(response)
	w.Write(data)
}
