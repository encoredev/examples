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

const ScheduledEvents: FC<{ displayedDay: Date }> = ({ displayedDay }) => {
  const { data: scheduledEvents } = useQuery(scheduledEventsQuery());

  const eventsToday = useMemo(() => {
    return (scheduledEvents?.bookings || []).filter((event) => {
      const start = new Date(event.start);
      return isSameDay(start, displayedDay);
    });
  }, [scheduledEvents, displayedDay]);

  return (
    <>
      {eventsToday.map((event) => {
        const start = new Date(event.start);
        const end = new Date(event.end);
        const minutesFromMidnight = getHours(start) * 60 + getMinutes(start);
        const duration = intervalToDuration({ start, end });
        const minutesDuration =
          (duration.hours || 0) * 60 + (duration.minutes || 0);

        return (
          <li
            key={event.Email + event.start}
            className="relative mt-px flex"
            style={{
              gridRow: minutesFromMidnight + " / span " + minutesDuration,
            }}
          >
            <Event event={event} />
          </li>
        );
      })}
    </>
  );
};

export default ScheduledEvents;

const Event: FC<{ event: booking.Booking }> = ({ event }) => {
  const start = new Date(event.start);
  const isCurrentDay = isSameDay(new Date(), start);
  const isPastEvent = start < new Date();
  const color = useMemo(() => {
    if (isPastEvent) return "gray";
    if (isCurrentDay) return "pink";
    return "blue";
  }, [isCurrentDay, isPastEvent]);

  return (
    <div
      className={`
        group absolute inset-1 flex flex-col overflow-y-auto rounded-lg
        bg-${color}-50 p-2 text-xs leading-5
        hover:bg-${color}-100 cursor-pointer
      `}
    >
      <p className={`order-1 font-semibold text-${color}-700`}>{event.Email}</p>
      <p className={`text-${color}-500 group-hover:text-${color}-700`}>
        <time dateTime={start.toString()}>{format(start, "HH:mm")}</time>
      </p>
    </div>
  );
};
