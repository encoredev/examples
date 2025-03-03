package admin

import "context"

type DashboardData struct {
	Foo int    `json:"foo"`
	Bar string `json:"bar"`
}

// encore:api auth
func GetDashboardData(ctx context.Context) (*DashboardData, error) {
	return &DashboardData{
		Foo: 42,
		Bar: "important data from the backend",
	}, nil
}
