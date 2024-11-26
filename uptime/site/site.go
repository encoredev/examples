// Service site keeps track of which sites to monitor.
package site

import (
	"context"
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"encore.dev/pubsub"
	"encore.dev/storage/sqldb"
)

// Site describes a monitored site.
type Site struct {
	// ID is a unique ID for the site.
	ID int `json:"id"`
	// URL is the site's URL.
	URL string `json:"url"`
}

// AddParams are the parameters for adding a site to be monitored.
type AddParams struct {
	// URL is the URL of the site. If it doesn't contain a scheme
	// (like "http:" or "https:") it defaults to "https:".
	URL string `json:"url"`
}

// Add adds a new site to the list of monitored websites.
//
//encore:api public method=POST path=/site
func (s *Service) Add(ctx context.Context, p *AddParams) (*Site, error) {
	// Prevent abuse by limiting the number of sites to 20.
	var count int64
	if err := s.db.Model(&Site{}).Count(&count).Error; err != nil {
		return nil, err
	} else if count >= 20 {
		return nil, fmt.Errorf("too many sites")
	}

	site := &Site{URL: p.URL}
	if err := s.db.Create(site).Error; err != nil {
		return nil, err
	}
	if _, err := SiteAddedTopic.Publish(ctx, site); err != nil {
		return nil, err
	}
	return site, nil
}

type ListResponse struct {
	// Sites is the list of monitored sites.
	Sites []*Site `json:"sites"`
}

// Get gets a site by id.
//
//encore:api public method=GET path=/site/:siteID
func (s *Service) Get(ctx context.Context, siteID int) (*Site, error) {
	var site Site
	if err := s.db.Where("id = $1", siteID).First(&site).Error; err != nil {
		return nil, err
	}
	return &site, nil
}

// Delete deletes a site by id.
//
//encore:api public method=DELETE path=/site/:siteID
func (s *Service) Delete(ctx context.Context, siteID int) error {
	return s.db.Delete(&Site{ID: siteID}).Error
}

// List lists the monitored websites.
//
//encore:api public method=GET path=/site
func (s *Service) List(ctx context.Context) (*ListResponse, error) {
	var sites []*Site
	if err := s.db.Find(&sites).Error; err != nil {
		return nil, err
	}
	return &ListResponse{Sites: sites}, nil
}

// This is a service struct, learn more: https://encore.dev/docs/go/primitives/service-structs
//
//encore:service
type Service struct {
	db *gorm.DB
}

// initService is automatically called by Encore when the service starts up.
func initService() (*Service, error) {
	db, err := gorm.Open(postgres.New(postgres.Config{
		Conn: db.Stdlib(),
	}))
	if err != nil {
		return nil, err
	}
	return &Service{db: db}, nil
}

// This creates a Pub/Sub topic, learn more: https://encore.dev/docs/go/primitives/pubsub
var SiteAddedTopic = pubsub.NewTopic[*Site]("site-added", pubsub.TopicConfig{
	DeliveryGuarantee: pubsub.AtLeastOnce,
})

// Define a database named 'site', using the database migrations
// in the "./migrations" folder. Encore automatically provisions,
// migrates, and connects to the database.
// Learn more: https://encore.dev/docs/go/primitives/databases
var db = sqldb.NewDatabase("site", sqldb.DatabaseConfig{
	Migrations: "./migrations",
})
