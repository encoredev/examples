package site

import (
	"context"
	"fmt"

	"encore.dev/cron"
	"encore.dev/pubsub"
	"encore.dev/storage/sqldb"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
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

// Reset resets the database to a known state to prevent abuse.
//
//encore:api private
func (s *Service) Reset(ctx context.Context) error {
	urlsToKeep := []string{
		"news.ycombinator.com",
		"google.com",
		"http://neverssl.com",
		"httpbin.org/status/400",
	}
	return s.db.Transaction(func(tx *gorm.DB) error {
		// Delete sites we don't want to keep
		if err := tx.Where("url NOT IN ?", urlsToKeep).Delete(&Site{}).Error; err != nil {
			return err
		}

		// Recreate sites that were deleted
		var sites []*Site
		for _, u := range urlsToKeep {
			sites = append(sites, &Site{URL: u})
		}
		err := tx.Clauses(clause.OnConflict{
			Columns:   []clause.Column{{Name: "url"}},
			DoNothing: true,
		}).Create(&sites).Error
		if err != nil {
			return err
		}

		// Publish Pub/Sub messages for the sites that were added
		for _, s := range sites {
			if s.ID > 0 {
				if _, err := SiteAddedTopic.Publish(ctx, s); err != nil {
					return err
				}
			}
		}

		return nil
	})
}

//encore:service
type Service struct {
	db *gorm.DB
}

var siteDB = sqldb.Named("site").Stdlib()

func initService() (*Service, error) {
	db, err := gorm.Open(postgres.New(postgres.Config{
		Conn: siteDB,
	}))
	if err != nil {
		return nil, err
	}
	return &Service{db: db}, nil
}

var SiteAddedTopic = pubsub.NewTopic[*Site]("site-added", pubsub.TopicConfig{
	DeliveryGuarantee: pubsub.AtLeastOnce,
})

// Reset all sites every 5 minutes to prevent abuse.
var _ = cron.NewJob("reset", cron.JobConfig{
	Title:    "Reset sites",
	Endpoint: Reset,
	Every:    5 * cron.Minute,
})
