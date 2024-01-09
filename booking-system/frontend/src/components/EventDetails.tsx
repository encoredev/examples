import React, { FC } from "react";
import { format, intervalToDuration } from "date-fns";
import {
  CalendarIcon,
  ClockIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import getUTCDateFromISO from "../lib/getUTCDateFromISO";

const EventDetails: FC<{
  event: {
    start: string;
    end: string;
    Email?: string;
  };
}> = ({ event }) => {
  const start = getUTCDateFromISO(event.start);
  const end = getUTCDateFromISO(event.end);
  const duration = intervalToDuration({ start, end });
  const durationStr =
    (duration.hours || 0) + (duration.minutes || 0) / 60 + "h";
  const dateStr =
    format(start, "HH:mm") +
    " - " +
    format(end, "HH:mm") +
    ", " +
    format(start, "EEEE, LLLL dd, yyyy") +
    " UTC";

  return (
    <ul className="divide-y divide-gray-200 w-full">
      <li className="flex items-center space-x-2 pb-2">
        <CalendarIcon className="h-5 w-5" />{" "}
        <span className="text-gray-500">{dateStr}</span>
      </li>

      <li className="flex items-center space-x-2 py-2 last:pb-0">
        <ClockIcon className="h-5 w-5" />{" "}
        <span className="text-gray-500">{durationStr}</span>
      </li>

      {event.Email && (
        <li className="flex items-center space-x-2 pt-2">
          <EnvelopeIcon className="h-5 w-5" />{" "}
          <span className="text-gray-500">{event.Email}</span>
        </li>
      )}
    </ul>
  );
};

export default EventDetails;
