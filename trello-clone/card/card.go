package card

import (
	"context"
	"fmt"
	"time"

	"encore.dev/storage/sqldb"
)

type Card struct {
	// ID is the unique id for the card.
	ID int64
	// BoardID is the board the card belongs to.
	BoardID int64
	// ColumnID is the column the card is listed in.
	ColumnID int64
	// Title is the title of the card.
	Title string
	// Description is the description of the card.
	Description string
	// Order is how the card is sorted in the column.
	Order int
	// Created is the time the card was created.
	Created time.Time
}

type CreateParams struct {
	// BoardID is the board the card is to be created in.
	BoardID int64
	// ColumnID is the column the card is to be created in.
	ColumnID int64
	// Title is the title of the new card.
	Title string
}

// Create creates a new card.
// encore:api
func Create(ctx context.Context, params *CreateParams) (*Card, error) {
	c := &Card{
		BoardID:     params.BoardID,
		ColumnID:    params.ColumnID,
		Title:       params.Title,
		Description: "", // empty when created
		Created:     time.Now(),
	}
	err := sqldb.QueryRow(ctx, `
		WITH max_order AS (
			SELECT COALESCE(MAX("order"), 0) AS max_order
			FROM card
			WHERE board_id = $1 AND column_id = $2
		)
		INSERT INTO card (board_id, column_id, title, description, "order", created)
		SELECT $1, $2, $3, $4, m.max_order + 1, $5
		FROM max_order m
		RETURNING id, "order"
	`, c.BoardID, c.ColumnID, c.Title, c.Description, c.Created).Scan(&c.ID, &c.Order)
	if err != nil {
		return nil, fmt.Errorf("could not create card: %v", err)
	}
	return c, nil
}

type ListParams struct {
	BoardID int64
}

type ListResponse struct {
	Cards []*Card
}

// List lists the cards for a given board, sorted by column id and order.
// encore:api
func List(ctx context.Context, params *ListParams) (*ListResponse, error) {
	rows, err := sqldb.Query(ctx, `
		SELECT id, column_id, title, description, "order", created
		FROM card
		WHERE board_id = $1
		ORDER BY column_id, "order"
	`, params.BoardID)
	if err != nil {
		return nil, fmt.Errorf("could not list cards: %v", err)
	}
	defer rows.Close()

	var cards []*Card
	for rows.Next() {
		c := &Card{BoardID: params.BoardID}
		err := rows.Scan(&c.ID, &c.ColumnID, &c.Title, &c.Description, &c.Order, &c.Created)
		if err != nil {
			return nil, fmt.Errorf("could not scan: %v", err)
		}
		cards = append(cards, c)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("could not iterate over rows: %v", err)
	}
	return &ListResponse{Cards: cards}, nil
}

type GetParams struct {
	// ID is the id of the card to retrieve.
	ID int64
}

// Get retrieves a specific card by id.
// encore:api public
func Get(ctx context.Context, params *GetParams) (*Card, error) {
	c := &Card{ID: params.ID}
	err := sqldb.QueryRow(ctx, `
		SELECT board_id, column_id, title, description, "order", created
		FROM card
		WHERE id = $1
	`, params.ID).Scan(&c.BoardID, &c.ColumnID, &c.Title, &c.Description, &c.Order, &c.Created)
	if err != nil {
		return nil, fmt.Errorf("could not get card: %v", err)
	}
	return c, nil
}

type UpdateParams struct {
	// ID is the card id to update.
	ID int64
	// Title is the new title. Empty string means keep unchanged.
	Title string
	// Description is the new description. Empty string means keep unchanged.
	Description string
	// ColumnID is the target column. Zero means keep unchanged.
	ColumnID int64
}

// Update updates a card title, description, or order.
// encore:api public
func Update(ctx context.Context, params *UpdateParams) (*Card, error) {
	var placeholder int // detect missing row
	err := sqldb.QueryRow(ctx, `
		UPDATE card SET
			title = (CASE WHEN $2 = '' THEN title ELSE $2 END),
			description = (CASE WHEN $3 = '' THEN description ELSE $3 END),
			column_id = (CASE WHEN $4 = 0 THEN column_id ELSE $4 END)
		WHERE id = $1
		RETURNING 1
	`, params.ID, params.Title, params.Description, params.ColumnID).Scan(&placeholder)
	if err != nil {
		return nil, fmt.Errorf("could not update card: %v", err)
	}
	return Get(ctx, &GetParams{ID: params.ID})
}
