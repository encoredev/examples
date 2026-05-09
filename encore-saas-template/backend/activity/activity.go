package activity

import (
	"context"
	"time"

	"encore.app/backend/user"
	"encore.dev/beta/errs"
	"encore.dev/rlog"
	"github.com/google/uuid"
)

type ActivityResponse struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	Event     string    `json:"event"`
	CreatedAt time.Time `json:"created_at"`
}

type ActivitiesResponse struct {
	Activities []*ActivityResponse `json:"activities"`
}

type FilterActivitiesRequest struct {
	Offset int `json:"offset"`
	Limit  int `json:"limit"`
}

type CreateActivityRequest struct {
	UserID string `json:"user_id"`
	Event  string `json:"event"`
}

//encore:api auth method=GET path=/v1/activities tag:admin
func (s *Service) GetActivities(ctx context.Context, p *FilterActivitiesRequest) (*ActivitiesResponse, error) {
	eb := errs.B()

	offset := p.Offset
	limit := p.Limit

	if offset < 0 {
		eb = eb.Code(errs.InvalidArgument).Msg("offset must be greater than 0")
	}

	if limit < 0 {
		eb = eb.Code(errs.InvalidArgument).Msg("limit must be greater than 0")
	}

	activities := make([]*Activity, 0)
	err := s.db.Find(&Activity{}).Offset(offset).Limit(limit).Find(&activities).Error
	if err != nil {
		return nil, eb.Cause(err).Code(errs.Internal).Msg("failed to get activities").Err()
	}

	activitiesResponse := make([]*ActivityResponse, 0)
	for _, activity := range activities {
		activitiesResponse = append(activitiesResponse, &ActivityResponse{
			ID:        activity.ID,
			UserID:    activity.UserID,
			Event:     activity.Event,
			CreatedAt: activity.CreatedAt,
		})
	}

	return &ActivitiesResponse{
		Activities: activitiesResponse,
	}, nil
}

func (s *Service) HandleSignupEvents(ctx context.Context, p *user.SignupEvent) error {
	eb := errs.B()
	rlog.Info("signup event", "user_id", p.UserID)

	activity := Activity{
		ID:        uuid.NewString(),
		UserID:    p.UserID,
		Event:     "signup",
		CreatedAt: time.Now(),
	}

	if err := s.db.Create(&activity).Error; err != nil {
		return eb.Cause(err).Code(errs.Internal).Msg("failed to create activity").Err()
	}

	return nil
}
