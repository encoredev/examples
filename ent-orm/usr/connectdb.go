package usr

import (
	"encore.dev/storage/sqldb"
	"entgo.io/ent/dialect"
	entsql "entgo.io/ent/dialect/sql"
	"go4.org/syncutil"

	"encore.app/usr/ent"
)

var usrDB = sqldb.Named("usr")

// Get returns an ent client connected to this service's database.
func Get() (*ent.Client, error) {
	// Attempt to setup the database client connection if it hasn't
	// already been successfully setup.
	err := once.Do(func() error {
		client = setup()
		return nil
	})
	return client, err
}

var (
	// once is like sync.Once except it re-arms itself on failure
	once syncutil.Once

	// client is the successfully created database client connection,
	// or nil when no such client has been setup yet.
	client *ent.Client
)

// setup sets up a database client connection by opening an ent driver using the
// named database `*sql.DB` pointer and creating a client from that driver.
func setup() *ent.Client {
	drv := entsql.OpenDB(dialect.Postgres, usrDB.Stdlib())
	return ent.NewClient(ent.Driver(drv))
}
