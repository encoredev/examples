import React, { FC } from "react";
import {
  format,
  getDay,
  getHours,
  getMinutes,
  intervalToDuration,
} from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { bookableSlotsQuery } from "../../lib/api";
import { booking } from "../../lib/client";
import { BookingReducerProps } from "../../lib/bookingReducer";
import getUTCDateFromISO from "../../lib/getUTCDateFromISO";

const BookableEvents: FC<BookingReducerProps> = ({ state, dispatch }) => {
  const firstDay = state.displayedDays[0];
  const { data: bookableSlots } = useQuery(bookableSlotsQuery(firstDay));

  return (
    <>
      {(bookableSlots || []).map((slot) => {
        const start = getUTCDateFromISO(slot.start);
        const end = getUTCDateFromISO(slot.end);
        const minutesFromMidnight = getHours(start) * 60 + getMinutes(start);
        const duration = intervalToDuration({ start, end });
        const minutesDuration =
          (duration.hours || 0) * 60 + (duration.minutes || 0);
        const weekDay = getDay(start);

        return (
          <li
            key={slot.start}
            className={`relative mt-[5px] flex col-start-${
              weekDay ? weekDay : 7
            }`}
            style={{
              gridRow: minutesFromMidnight + " / span " + minutesDuration,
            }}
          >
            <Event event={slot} state={state} dispatch={dispatch} />
          </li>
        );
      })}
    </>
  );
};

export default BookableEvents;

const Event: FC<BookingReducerProps & { event: booking.BookableSlot }> = ({
  event,
  dispatch,
}) => {
  const start = getUTCDateFromISO(event.start);
  const color = "blue";
  const title = "Available";

  return (
    <div
      onClick={() => dispatch({ type: "showBookingModal", value: event })}
      className={`
          group absolute inset-1 flex flex-col overflow-y-auto rounded-lg
          bg-${color}-50 p-2 text-xs leading-5 hover:bg-${color}-100 cursor-pointer
      `}
    >
      <p className={`order-1 font-semibold text-${color}-700`}>{title}</p>
      <p className={`text-${color}-500 group-hover:text-${color}-700`}>
        <time dateTime={start.toString()}>{format(start, "HH:mm")}</time>
      </p>
    </div>
  );
};
