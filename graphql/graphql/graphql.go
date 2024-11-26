// Service graphql exposes a GraphQL API.
package graphql

import (
	"net/http"

	"encore.app/graphql/generated"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
)

//go:generate go run github.com/99designs/gqlgen generate

// This is a service struct, learn more: https://encore.dev/docs/go/primitives/service-structs
//
//encore:service
type Service struct {
	srv        *handler.Server
	playground http.Handler
}

// initService is automatically called by Encore when the service starts up.
func initService() (*Service, error) {
	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &Resolver{}}))
	pg := playground.Handler("GraphQL Playground", "/graphql")
	return &Service{srv, pg}, nil
}

// Exposes the graphql API using a raw endpoint.
//
// Learn more: https://encore.dev/docs/go/primitives/raw-endpoints
//
//encore:api public raw path=/graphql
func (s *Service) Query(w http.ResponseWriter, req *http.Request) {
	s.srv.ServeHTTP(w, req)
}

//encore:api public raw path=/graphql/playground
func (s *Service) Playground(w http.ResponseWriter, req *http.Request) {
	s.playground.ServeHTTP(w, req)
}
