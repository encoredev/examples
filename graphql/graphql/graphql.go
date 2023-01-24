package graphql

import (
	"net/http"

	"encore.app/graphql/generated"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
)

//go:generate go run github.com/99designs/gqlgen generate

//encore:service
type Service struct {
	srv        *handler.Server
	playground http.Handler
}

func initService() (*Service, error) {
	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &Resolver{}}))
	pg := playground.Handler("GraphQL Playground", "/graphql")
	return &Service{srv, pg}, nil
}

//encore:api public raw path=/graphql
func (s *Service) Query(w http.ResponseWriter, req *http.Request) {
	s.srv.ServeHTTP(w, req)
}

//encore:api public raw path=/graphql/playground
func (s *Service) Playground(w http.ResponseWriter, req *http.Request) {
	s.playground.ServeHTTP(w, req)
}
