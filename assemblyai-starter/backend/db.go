package backend

import (
	"context"

	"encore.dev/storage/sqldb"
)

var db = sqldb.NewDatabase("transcript", sqldb.DatabaseConfig{
	Migrations: "./migrations",
})

func insert(ctx context.Context, transcriptID, name, status string) error {
	_, err := db.Exec(ctx, `
        INSERT INTO transcripts (id, name, status, submitted_at)
        VALUES ($1, $2, $3, NOW())
    `, transcriptID, name, status)

	return err
}

func update(ctx context.Context, transcriptID, status string, transcript []byte) error {
	_, err := db.Exec(ctx, `
        UPDATE
			transcripts
		SET
			status = $2, raw_transcript = $3, finished_at = NOW()
		WHERE
			id = $1

    `, transcriptID, status, transcript)

	return err
}

func list(ctx context.Context) ([]Transcription, error) {
	rows, err := db.Query(ctx, `SELECT id, name, status, submitted_at FROM transcripts ORDER BY submitted_at DESC`)
	if err != nil {
		return nil, err
	}

	transcriptions := []Transcription{}

	for rows.Next() {
		var transcript Transcription

		err := rows.Scan(&transcript.ID, &transcript.Name, &transcript.Status, &transcript.SubmittedAt)
		if err != nil {
			return nil, err
		}

		transcriptions = append(transcriptions, transcript)
	}

	return transcriptions, nil
}
