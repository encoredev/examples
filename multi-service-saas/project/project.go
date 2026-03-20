// Service project manages projects with plan-based limits.
package project

import (
	"context"
	"fmt"
	"time"

	"encore.app/billing"
	"encore.dev/beta/auth"
	"encore.dev/beta/errs"
	"encore.dev/storage/sqldb"
	"github.com/google/uuid"
)

var db = sqldb.NewDatabase("project", sqldb.DatabaseConfig{
	Migrations: "./migrations",
})

// Plan limits for the number of projects a user can create.
// A limit of 0 means unlimited.
var planLimits = map[string]int{
	"free":       3,
	"pro":        25,
	"enterprise": 0,
}

// Project represents a project.
type Project struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	OwnerID     string `json:"owner_id"`
	CreatedAt   string `json:"created_at"`
}

// CreateRequest is the request to create a project.
type CreateRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

// Create creates a project. Enforces plan-based limits on the number of projects per user.
//
//encore:api auth method=POST path=/projects
func Create(ctx context.Context, req *CreateRequest) (*Project, error) {
	uid, _ := auth.UserID()
	ownerID := string(uid)

	// Check the owner's plan to determine project limit.
	sub, err := billing.Get(ctx)
	if err != nil {
		return nil, err
	}
	limit, ok := planLimits[sub.Plan]
	if !ok {
		limit = planLimits["free"]
	}

	// Count existing projects for this user.
	var count int
	err = db.QueryRow(ctx, `
		SELECT COUNT(*)::int FROM projects WHERE owner_id = $1
	`, ownerID).Scan(&count)
	if err != nil {
		return nil, err
	}

	if limit > 0 && count >= limit {
		return nil, &errs.Error{
			Code:    errs.PermissionDenied,
			Message: fmt.Sprintf("project limit reached (%d on %s plan). Upgrade to create more.", limit, sub.Plan),
		}
	}

	id := uuid.New().String()

	_, err = db.Exec(ctx, `
		INSERT INTO projects (id, name, description, owner_id)
		VALUES ($1, $2, $3, $4)
	`, id, req.Name, req.Description, ownerID)
	if err != nil {
		return nil, err
	}

	return &Project{
		ID:          id,
		Name:        req.Name,
		Description: req.Description,
		OwnerID:     ownerID,
		CreatedAt:   time.Now().Format(time.RFC3339),
	}, nil
}

// Get gets a project by ID.
//
//encore:api public method=GET path=/projects/:id
func Get(ctx context.Context, id string) (*Project, error) {
	var p Project
	var t time.Time
	err := db.QueryRow(ctx, `
		SELECT id, name, description, owner_id, created_at
		FROM projects WHERE id = $1
	`, id).Scan(&p.ID, &p.Name, &p.Description, &p.OwnerID, &t)
	if err != nil {
		return nil, &errs.Error{Code: errs.NotFound, Message: "project not found"}
	}
	p.CreatedAt = t.Format(time.RFC3339)
	return &p, nil
}

// ListRequest is the request to list projects.
type ListRequest struct {
	OwnerID string `query:"owner_id"`
}

// ListResponse is the response for listing projects.
type ListResponse struct {
	Projects []Project `json:"projects"`
}

// List lists projects. Optionally filter by owner_id.
//
//encore:api public method=GET path=/projects
func List(ctx context.Context, req *ListRequest) (*ListResponse, error) {
	var rows *sqldb.Rows
	var err error

	if req.OwnerID != "" {
		rows, err = db.Query(ctx, `
			SELECT id, name, description, owner_id, created_at
			FROM projects WHERE owner_id = $1
			ORDER BY created_at DESC
		`, req.OwnerID)
	} else {
		rows, err = db.Query(ctx, `
			SELECT id, name, description, owner_id, created_at
			FROM projects ORDER BY created_at DESC
		`)
	}
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var projects []Project
	for rows.Next() {
		var p Project
		var t time.Time
		if err := rows.Scan(&p.ID, &p.Name, &p.Description, &p.OwnerID, &t); err != nil {
			return nil, err
		}
		p.CreatedAt = t.Format(time.RFC3339)
		projects = append(projects, p)
	}

	return &ListResponse{Projects: projects}, nil
}
