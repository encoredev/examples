package booking

import (
	"fmt"
	"github.com/jackc/pgx/v5/pgtype"
)

func timeToStr(t pgtype.Time) *string {
	if !t.Valid {
		return nil
	}
	seconds := t.Microseconds / 1e6
	minutes := seconds / 60
	hours := minutes / 60
	s := fmt.Sprintf("%02d:%02d", hours, minutes%60)
	return &s
}

func strToTime(s *string) (pgtype.Time, error) {
	if s == nil {
		return pgtype.Time{Valid: false}, nil
	}

	var hours, minutes int
	if _, err := fmt.Sscanf(*s, "%d:%d", &hours, &minutes); err != nil {
		return pgtype.Time{Valid: false}, err
	}
	return pgtype.Time{
		Valid:        true,
		Microseconds: int64(hours*3600+minutes*60) * 1e6,
	}, nil
}
