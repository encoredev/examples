// Package agent runs a Google ADK agent as an Encore service.
package agent

import (
	"context"
	"fmt"

	"encore.dev/storage/sqldb"
	"google.golang.org/adk/v2/agent/llmagent"
	"google.golang.org/adk/v2/runner"
	"google.golang.org/adk/v2/session"
	"google.golang.org/adk/v2/session/database"
	"google.golang.org/adk/v2/tool"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

const appName = "notes_agent"

var db = sqldb.NewDatabase("agent", sqldb.DatabaseConfig{Migrations: "./migrations"})

//encore:service
type Service struct {
	runner   *runner.Runner
	sessions session.Service
	mode     string
}

func initService() (*Service, error) {
	// ADK's GORM session store, pointed at the Encore-managed Postgres database.
	sessions, err := database.NewSessionService(
		postgres.New(postgres.Config{Conn: db.Stdlib()}),
		&gorm.Config{Logger: logger.Default.LogMode(logger.Silent)},
	)
	if err != nil {
		return nil, fmt.Errorf("session service: %w", err)
	}
	// Tables come from migrations/1_adk_sessions.up.sql rather than database.AutoMigrate.

	llm, mode, err := newModel(context.Background())
	if err != nil {
		return nil, err
	}
	tools, err := noteTools()
	if err != nil {
		return nil, err
	}
	a, err := llmagent.New(llmagent.Config{
		Name:        appName,
		Model:       llm,
		Description: "Keeps short notes for the user.",
		Instruction: "You help the user keep short notes. Use add_note to save a note and list_notes to read them. Keep answers brief.",
		Tools:       []tool.Tool{tools[0], tools[1]},
	})
	if err != nil {
		return nil, err
	}
	r, err := runner.New(runner.Config{AppName: appName, Agent: a, SessionService: sessions})
	if err != nil {
		return nil, err
	}
	return &Service{runner: r, sessions: sessions, mode: mode}, nil
}
