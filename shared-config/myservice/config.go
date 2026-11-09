package config

import (
	"context"

	"encore.app/sharedconfig"
	"encore.dev/config"
)

type Config struct {
	Shared sharedconfig.Config
}

var cfg = config.Load[*Config]()

type GetResponse struct {
	EnableFoo bool
}

//encore:api public method=GET path=/config
func Get(_ context.Context) (*GetResponse, error) {
	return &GetResponse{
		EnableFoo: cfg.Shared.EnableFoo,
	}, nil
}
