package booking

import (
	"context"
	"encore.app/booking/db"
	"encore.dev/beta/errs"
	"encore.dev/rlog"
	"errors"
)

type Availability struct {
	Start *string `json:"start" encore:"optional"`
	End   *string `json:"end" encore:"optional"`
}

type GetAvailabilityResponse struct {
	Availability []Availability
}

//encore:api public method=GET path=/availability
func GetAvailability(ctx context.Context) (*GetAvailabilityResponse, error) {
	rows, err := query.GetAvailability(ctx)
	if err != nil {
		return nil, err
	}

	availability := make([]Availability, 7)
	for _, row := range rows {
		day := row.Weekday
		if day < 0 || day > 6 {
			rlog.Error("invalid week day in availability table", "row", row)
			continue
		}

		// These never fail
		start, _ := row.StartTime.TimeValue()
		end, _ := row.EndTime.TimeValue()
		availability[day] = Availability{
			Start: timeToStr(start),
			End:   timeToStr(end),
		}
	}

	return &GetAvailabilityResponse{Availability: availability}, nil
}

type SetAvailabilityParams struct {
	Availability []Availability
}

//encore:api auth method=POST path=/availability
func SetAvailability(ctx context.Context, params SetAvailabilityParams) error {
	eb := errs.B()
	tx, err := pgxdb.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(context.Background()) // committed explicitly on success

	qry := query.WithTx(tx)
	for weekday, a := range params.Availability {
		if weekday > 6 {
			return eb.Code(errs.InvalidArgument).Msgf("invalid weekday %d", weekday).Err()
		}

		start, err1 := strToTime(a.Start)
		end, err2 := strToTime(a.End)
		if err := errors.Join(err1, err2); err != nil {
			return eb.Cause(err).Code(errs.InvalidArgument).Msg("invalid start/end time").Err()
		} else if start.Valid != end.Valid {
			return eb.Code(errs.InvalidArgument).Msg("both start/stop must be set, or both null").Err()
		} else if start.Valid && start.Microseconds > end.Microseconds {
			return eb.Code(errs.InvalidArgument).Msg("start must be before end").Err()
		}

		err = qry.UpdateAvailability(ctx, db.UpdateAvailabilityParams{
			Weekday:   int16(weekday),
			StartTime: start,
			EndTime:   end,
		})
		if err != nil {
			return eb.Cause(err).Code(errs.Unavailable).Msg("failed to update availability").Err()
		}
	}

	err = tx.Commit(ctx)
	return errs.WrapCode(err, errs.Unavailable, "failed to commit transaction")
}
