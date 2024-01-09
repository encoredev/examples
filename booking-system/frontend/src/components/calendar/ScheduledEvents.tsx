import React, { FC, useMemo } from "react";
import {
  format,
  getHours,
  getMinutes,
  intervalToDuration,
  isSameDay,
} from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { scheduledEventsQuery } from "../../lib/api";
import { booking } from "../../lib/client";
import { AdminReducerProps } from "../../lib/adminReducer";
import getCurrentUTCDate from "../../lib/getCurrentUTCDate";
import getUTCDateFromISO from "../../lib/getUTCDateFromISO";

const ScheduledEvents: FC<AdminReducerProps> = ({ state, dispatch }) => {
  const { data: scheduledEvents } = useQuery(scheduledEventsQuery());

  const eventsToday = useMemo(() => {
    return (scheduledEvents?.bookings || []).filter((event) => {
      const start = getUTCDateFromISO(event.start);
      return isSameDay(start, state.displayedDay);
    });
  }, [scheduledEvents, state.displayedDay]);

  return (
    <>
      {eventsToday.map((event) => {
        const start = getUTCDateFromISO(event.start);
        const end = getUTCDateFromISO(event.end);
        const minutesFromMidnight = getHours(start) * 60 + getMinutes(start);
        const duration = intervalToDuration({ start, end });
        const minutesDuration =
          (duration.hours || 0) * 60 + (duration.minutes || 0);

        return (
          <li
            key={event.Email + event.start}
            className="relative mt-[5px] flex col-start-1"
            style={{
              gridRow: minutesFromMidnight + " / span " + minutesDuration,
            }}
          >
            <Event event={event} state={state} dispatch={dispatch} />
          </li>
        );
      })}
    </>
  );
};

export default ScheduledEvents;

const Event: FC<AdminReducerProps & { event: booking.Booking }> = ({
  event,
  dispatch,
}) => {
  const start = getUTCDateFromISO(event.start);
  const end = getUTCDateFromISO(event.end);
  const isCurrentDay = isSameDay(getCurrentUTCDate(), start);
  const isPastEvent = start < getCurrentUTCDate();
  const color = useMemo(() => {
    if (isPastEvent) return "gray";
    if (isCurrentDay) return "pink";
    return "blue";
  }, [isCurrentDay, isPastEvent]);

  return (
    <div
      onClick={() =>
        dispatch({ type: "showScheduledEventModal", value: event })
      }
      className={`
        group absolute inset-1 flex flex-col overflow-y-auto rounded-lg
        bg-${color}-50 p-2 text-xs leading-5
        hover:bg-${color}-100 cursor-pointer
      `}
    >
      <p className={`font-semibold text-${color}-700`}>{event.Email}</p>
      <p className={`text-${color}-500 group-hover:text-${color}-700`}>
        <time dateTime={start.toString()}>
          {format(start, "HH:mm")} - {format(end, "HH:mm")}
        </time>
      </p>
    </div>
  );
};
