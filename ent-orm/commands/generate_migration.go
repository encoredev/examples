package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"text/template"

	"ariga.io/atlas/sql/migrate"
	"ariga.io/atlas/sql/sqltool"
	"entgo.io/ent/dialect"
	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/schema"
	_ "github.com/lib/pq"

	"encore.app/usr/ent"
)

const system = "usr"
const dirPathTemplate = "./%s/migrations"
const migrationFilePathTemplate = "%d_ent_migration"

func openPostgresConnection(connectionString string) *sql.Driver {
	driver, err := sql.Open(dialect.Postgres, connectionString)
	if err != nil {
		log.Fatalf("failed to connect to the database. %s", err)
		return nil
	}
	return driver
}

// The migration count is either 1 is the files couldn't be read, or the number of files
// + 1 if we can read them. This makes sure the migration file's index is always incremented.
func createMigrationName() string {
	count := 1
	dirPath := fmt.Sprintf(dirPathTemplate, system)

	files, err := os.ReadDir(dirPath)
	if err != nil {
		log.Printf("failed to list files in the migrations directory, will generate the count as 1. %s", err)
	} else {
		count = len(files) + 1
	}

	return fmt.Sprintf(migrationFilePathTemplate, count)
}

func createMigrateDir() *sqltool.GolangMigrateDir {
	// Create a local migration directory able to understand golang-migrate migration files for replay.
	dirPath := fmt.Sprintf(dirPathTemplate, system)

	dir, err := sqltool.NewGolangMigrateDir(dirPath)
	if err != nil {
		log.Fatalf("failed creating atlas migration directory: %v", err)
		return nil
	}

	return dir
}

func main() {
	ctx := context.Background()
	connectionString := os.Args[1]
	driver := openPostgresConnection(connectionString)
	migrationName := createMigrationName()
	migrateDir := createMigrateDir()

	// Create a formatter for the migration files. This will make sure they generate
	// with a name encore can parse and valid SQL content. This will only generate the
	// up migrations.
	formatter, err := migrate.NewTemplateFormatter(
		template.Must(template.New("name").Parse("{{ .Name }}.up.sql")),
		template.Must(template.New("name").Parse(`{{range .Changes}}{{print .Cmd}};{{ println }}{{end}}`)),
	)
	if err != nil {
		log.Fatalf("failed creating an atlas formatter: %v", err)
	}

	// Create a client for the migration using the SQL driver connected to the system's database
	versionedClient := ent.NewClient(ent.Driver(driver))

	// Write the migration diff without a checksum file
	// (Encore expects only SQL files in the migration directory)
	opts := []schema.MigrateOption{
		schema.WithDir(migrateDir),
		schema.DisableChecksum(),
		schema.WithFormatter(formatter),
	}

	// Generate migrations using Atlas.
	err = versionedClient.Schema.NamedDiff(ctx, migrationName, opts...)
	if err != nil {
		log.Fatalf("failed generating migration file: %v", err)
	}
}
