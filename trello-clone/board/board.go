package board

import (
	"context"
	"fmt"
	"time"

	"encore.app/card"
	"encore.dev/storage/sqldb"
	"golang.org/x/sync/errgroup"
)

type Board struct {
	// ID is the unique id for the board.
	ID int64
	// Name is the name of the board.
	Name string
	// Created is the time the board was created.
	Created time.Time
	// Columns are the columns in the board.
	// It is only populated for Get requests.
	Columns []*Column
}

type CreateParams struct {
	// Name is the name of the board.
	Name string
}

// Create creates a new board.
// encore:api public
func Create(ctx context.Context, params *CreateParams) (*Board, error) {
	b := &Board{Name: params.Name, Created: time.Now()}
	err := sqldb.QueryRow(ctx, `
		INSERT INTO board (name, created)
		VALUES ($1, $2)
		RETURNING id
	`, params.Name, b.Created).Scan(&b.ID)
	if err != nil {
		return nil, fmt.Errorf("could not create board: %v", err)
	}
	return b, nil
}

type ListParams struct {
	// Limit is the maximum number of boards to return.
	// It is limited to at most 100.
	Limit int
	// Offset is the offset into the whole collection.
	Offset int
}

type ListResponse struct {
	Boards []*Board
}

// List lists the accessible boards.
// encore:api public
func List(ctx context.Context, params *ListParams) (*ListResponse, error) {
	rows, err := sqldb.Query(ctx, `
		SELECT id, name, created
		FROM board
		ORDER BY created DESC
	`)
	if err != nil {
		return nil, fmt.Errorf("could not list boards: %v", err)
	}
	defer rows.Close()

	boards := []*Board{}
	for rows.Next() {
		var b Board
		if err := rows.Scan(&b.ID, &b.Name, &b.Created); err != nil {
			return nil, fmt.Errorf("could not scan: %v", err)
		}
		boards = append(boards, &b)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("could not iterate over rows: %v", err)
	}
	return &ListResponse{Boards: boards}, nil
}

type GetParams struct {
	// ID is the board's unique id.
	ID int64
}

// Get gets detailed information about a board.
// encore:api public
func Get(ctx context.Context, params *GetParams) (*Board, error) {
	b := &Board{ID: params.ID}
	err := sqldb.QueryRow(ctx, `
		SELECT name, created
		FROM board
		WHERE id = $1
	`, params.ID).Scan(&b.Name, &b.Created)
	if err != nil {
		return nil, fmt.Errorf("could not get boards: %v", err)
	}

	// Fetch the columns and cards in parallel.
	var (
		cards   []*card.Card
		columns []*Column
	)
	{
		g, ctx := errgroup.WithContext(ctx)

		g.Go(func() error {
			resp, err := ListColumns(ctx, &ListColumnsParams{
				BoardIDs: []int64{params.ID},
			})
			if err != nil {
				return fmt.Errorf("could not get board columns: %v", err)
			}
			columns = resp.Columns
			return nil
		})

		g.Go(func() error {
			resp, err := card.List(ctx, &card.ListParams{
				BoardID: params.ID,
			})
			if err != nil {
				return fmt.Errorf("could not get cards: %v", err)
			}
			cards = resp.Cards
			return nil
		})

		if err := g.Wait(); err != nil {
			return nil, err
		}
	}

	b.Columns = columns
	mergeCardsAndColumns(columns, cards)

	return b, nil
}

func mergeCardsAndColumns(cols []*Column, cards []*card.Card) {
	m := make(map[int64]*Column)
	for _, c := range cols {
		m[c.ID] = c
	}
	for _, c := range cards {
		if col := m[c.ColumnID]; col != nil {
			col.Cards = append(col.Cards, c)
		}
	}
}
