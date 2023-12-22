package booking

import (
	"context"
	"errors"
	"slices"
	"time"
)

type BookableSlot struct {
	Start time.Time `json:"start"`
	End   time.Time `json:"end"`
}

type SlotsParams struct{}

type SlotsResponse struct{ Slots []BookableSlot }

//encore:api public method=GET path=/slots/:from
func GetBookableSlots(ctx context.Context, from string) (*SlotsResponse, error) {
	fromDate, err := time.Parse("2006-01-02", from)
	if err != nil {
		return nil, err
	}

	availabilityResp, err := GetAvailability(ctx)
	if err != nil {
		return nil, err
	}
	availability := availabilityResp.Availability

	const numDays = 7

	var slots []BookableSlot
	for i := 0; i < numDays; i++ {
		date := fromDate.AddDate(0, 0, i)
		weekday := int(date.Weekday())
		if len(availability) <= weekday {
			break
		}
		daySlots, err := bookableSlotsForDay(date, &availability[weekday])
		if err != nil {
			return nil, err
		}
		slots = append(slots, daySlots...)
	}

	// Get bookings for the next 7 days.
	activeBookings, err := listBookingsBetween(ctx, fromDate, fromDate.AddDate(0, 0, numDays))
	if err != nil {
		return nil, err
	}

	slots = filterBookableSlots(slots, time.Now(), activeBookings)
	return &SlotsResponse{Slots: slots}, nil
}

func bookableSlotsForDay(date time.Time, avail *Availability) ([]BookableSlot, error) {
	if avail.Start == nil || avail.End == nil {
		return nil, nil
	}
	availStartTime, err1 := strToTime(avail.Start)
	availEndTime, err2 := strToTime(avail.End)
	if err := errors.Join(err1, err2); err != nil {
		return nil, err
	}

	availStart := date.Add(time.Duration(availStartTime.Microseconds) * time.Microsecond)
	availEnd := date.Add(time.Duration(availEndTime.Microseconds) * time.Microsecond)

	// Compute the bookable slots in this day, based on availability.
	var slots []BookableSlot
	start := availStart
	for {
		end := start.Add(DefaultBookingDuration)
		if end.After(availEnd) {
			break
		}
		slots = append(slots, BookableSlot{
			Start: start,
			End:   end,
		})
		start = end
	}

	return slots, nil
}

func filterBookableSlots(slots []BookableSlot, now time.Time, bookings []*Booking) []BookableSlot {
	// Remove slots for which the start time has already passed.
	slots = slices.DeleteFunc(slots, func(s BookableSlot) bool {
		// Has the slot already passed?
		if s.Start.Before(now) {
			return true
		}

		// Is there a booking that overlaps with this slot?
		for _, b := range bookings {
			if b.Start.Before(s.End) && b.End.After(s.Start) {
				return true
			}
		}

		return false
	})
	return slots
}
