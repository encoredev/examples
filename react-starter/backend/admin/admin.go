package admin

import (
	"context"
)

type DashboardData struct {
	Value string `json:"value"`
}

// Endpoints annotated with `auth` are public and requires authentication
// Learn more: encore.dev/docs/primitives/services-and-apis#access-controls
//
//encore:api auth method=GET path=/admin
func GetAdminDashboardData(ctx context.Context) (*DashboardData, error) {
	return &DashboardData{Value: "Important stuff"}, nil
}
