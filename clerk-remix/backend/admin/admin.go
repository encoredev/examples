package admin

import (
	"context"

	a "encore.app/backend/auth"
	"encore.dev/beta/auth"
	"encore.dev/rlog"
)

type DashboardData struct {
	Value string `json:"value"`
}

// Endpoints annotated with `auth` are public and requires authentication
// Learn more: encore.dev/docs/go/primitives/defining-apis#access-controls
//
//encore:api auth method=GET path=/admin
func GetAdminDashboardData(ctx context.Context) (*DashboardData, error) {
	rlog.Info("Admin dashboard data requested", "user", auth.Data().(*a.UserData))
	return &DashboardData{Value: "Important stuff"}, nil
}
