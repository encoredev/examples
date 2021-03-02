package board

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"encore.app/card"
	"encore.dev/storage/sqldb"
)

type Column struct {
	// ID is the unique id for the column.
	ID int64
	// BoardID is the id of the board it belongs to.
	BoardID int64
	// Name is the name of the column.
	Name string
	// Order is the order of the column within the board.
	Order int
	// Cards are the cards in the column.
	Cards []*card.Card
}

type CreateColumnParams struct {
	// BoardID is the id of the board for which
	// to create the column.
	BoardID int64
	// Name is the name of the column.
	Name string
}

// CreateColumn creates a new column.
// Its order is set to be after all other columns.
// encore:api public
func CreateColumn(ctx context.Context, params *CreateColumnParams) (*Column, error) {
	c := &Column{BoardID: params.BoardID, Name: params.Name, Cards: []*card.Card{}}
	err := sqldb.QueryRow(ctx, `
		WITH max_order AS (
			SELECT COALESCE(MAX("order"), 0) AS max_order
			FROM board_column
			WHERE board_id = $1
		)
		INSERT INTO board_column (board_id, name, "order")
		SELECT $1, $2, m.max_order + 1 
		FROM max_order m
		RETURNING id, "order"
	`, params.BoardID, params.Name).Scan(&c.ID, &c.Order)
	if err != nil {
		return nil, fmt.Errorf("could not create column: %v", err)
	}
	return c, nil
}

type ListColumnsParams struct {
	BoardIDs []int64
}

type ListColumnsResponse struct {
	Columns []*Column
}

// ListColumns fetches the columns for one or more boards.
// The columns are returned sorted first by board id and then by the
// per-board sort order.
//
// encore:api
func ListColumns(ctx context.Context, params *ListColumnsParams) (*ListColumnsResponse, error) {
	rows, err := sqldb.Query(ctx, `
		SELECT id, board_id, name, "order"
		FROM board_column
		WHERE board_id = ANY($1)
		ORDER BY board_id ASC, "order" ASC
	`, params.BoardIDs)
	if err != nil {
		return nil, fmt.Errorf("could not list columns: %v", err)
	}
	defer rows.Close()

	cols := []*Column{}
	for rows.Next() {
		c := &Column{Cards: []*card.Card{}}
		if err := rows.Scan(&c.ID, &c.BoardID, &c.Name, &c.Order); err != nil {
			return nil, fmt.Errorf("could not scan: %v", err)
		}
		cols = append(cols, c)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("could not iterate over rows: %v", err)
	}

	return &ListColumnsResponse{Columns: cols}, nil
}

type AddCardParams struct {
	// BoardID is the board to add the card to.
	BoardID int64
	// ColumnID is the column to add the card to.
	ColumnID int64
	// Title is the new card's title.
	Title string
}

type AddCardResponse struct {
	Card *card.Card
}

// AddCard adds a new card to a column.
// encore:api public
func AddCard(ctx context.Context, params *AddCardParams) (*AddCardResponse, error) {
	// Make sure the column exists before we add the card.
	var placeholder int // detect missing row
	err := sqldb.QueryRow(ctx, `
		SELECT 1 FROM board_column
		WHERE board_id = $1 AND id = $2
	`, params.BoardID, params.ColumnID).Scan(&placeholder)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, fmt.Errorf("column does not exist: board_id=%d column_id=%d",
			params.BoardID, params.ColumnID)
	} else if err != nil {
		return nil, err
	}

	card, err := card.Create(ctx, &card.CreateParams{
		BoardID:  params.BoardID,
		ColumnID: params.ColumnID,
		Title:    params.Title,
	})
	if err != nil {
		return nil, err
	}
	return &AddCardResponse{Card: card}, nil
}
