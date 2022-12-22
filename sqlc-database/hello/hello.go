package hello

import (
	"context"
	"encore.app/hello/store"
	"fmt"

	"encore.dev/storage/sqldb"
)

var db = sqldb.Named("hello").Stdlib()

// encore:service
type Service struct {
	repo store.Querier
}

func initService() (*Service, error) {
	return &Service{
		repo: store.New(db),
	}, nil
}

type ThereParams struct {
	// Name is the name of the person.
	Name string
}

type ThereResponse struct {
	// Message is the greeting response.
	Message string
}

// There responds with a personalized greeting.
//
// encore:api public
func (s *Service) There(ctx context.Context, params *ThereParams) (*ThereResponse, error) {
	message, err := s.generateGreeting(ctx, params.Name)
	if err != nil {
		return nil, err
	}
	return &ThereResponse{Message: message}, nil
}

func (s *Service) generateGreeting(ctx context.Context, name string) (string, error) {
	count, err := s.repo.IncrementMeetingCount(ctx, name)
	if err != nil {
		return "", fmt.Errorf("could not update people table: %v", err)
	}

	if count == 1 {
		return fmt.Sprintf("Nice to meet you, %s.", name), nil
	}
	return fmt.Sprintf("Hey again, %s! We've met %d time(s) before.", name, count-1), nil
}
