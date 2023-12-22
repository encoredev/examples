import React from "react";
import { useBookingReducer } from "../../lib/bookingReducer";
import WeekViewHeader from "../calendar/WeekViewHeader";
import WeekViewDaysRow from "../calendar/WeekViewDaysRow";
import CalendarHourRows from "../calendar/CalendarHourRows";
import WeekViewDayDividers from "../calendar/WeekViewDayDividers";
import WeekViewEventGrid from "../calendar/WeekViewEventGrid";
import WeekViewAvailability from "../calendar/WeekViewAvailability";
import BookableEvents from "../calendar/BookableEvents";
import { BookingCalendarTimeIndicator } from "../calendar/CalendarTimeIndicator";
import BookingModal from "../BookingModal";

export default function BookingCalendarPage() {
  const { state, dispatch } = useBookingReducer();
  const reducerProps = { state, dispatch };

  return (
    <div className="p-4 h-[calc(100vh-80px)] overflow-hidden">
      <BookingModal
        event={state.modalEvent}
        setClose={() => dispatch({ type: "hideBookingModal" })}
      />

      <div className="flex flex-col h-full border border-gray-300">
        <WeekViewHeader {...reducerProps} />

        <div className="isolate flex flex-auto flex-col overflow-auto bg-white">
          <div
            style={{ width: "165%" }}
            className="flex flex-none flex-col max-w-none md:max-w-full"
          >
            <WeekViewDaysRow {...reducerProps} />

            <div className="flex flex-auto">
              <div className="sticky left-0 z-10 w-14 flex-none bg-white ring-1 ring-gray-100" />
              <div className="grid flex-auto grid-cols-1 grid-rows-1">
                <CalendarHourRows />

                <WeekViewDayDividers />

                <WeekViewEventGrid>
                  <WeekViewAvailability />
                  <BookableEvents {...reducerProps} />
                  <BookingCalendarTimeIndicator
                    displayedDays={state.displayedDays}
                  />
                </WeekViewEventGrid>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
