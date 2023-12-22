import React, { FC } from "react";
import { getDay, getHours, getMinutes, isSameDay } from "date-fns";

export const BookingCalendarTimeIndicator: FC<{ displayedDays: Date[] }> = ({
  displayedDays,
}) => {
  const today = displayedDays.find((day) => {
    return isSameDay(new Date(), day);
  });

  if (!today) return null;

  return <TimeIndicator colStart={getDay(today)} />;
};

export const AdminCalendarTimeIndicator: FC<{ displayedDay: Date }> = ({
  displayedDay,
}) => {
  const isToday = isSameDay(new Date(), displayedDay);

  if (!isToday) return null;

  return <TimeIndicator />;
};

const TimeIndicator: FC<{ colStart?: number }> = ({ colStart }) => {
  const now = new Date();
  const minutesFromMidnight = getHours(now) * 60 + getMinutes(now);

  return (
    <li
      className={`relative flex ${colStart ? "col-start-" + colStart : ""}`}
      style={{
        gridRow: minutesFromMidnight + " / span 1",
      }}
    >
      <div className="group absolute inset-0 flex items-center">
        <div className="absolute bg-red-500 rounded-full h-[10px] w-[10px] -top-[5px]"></div>
        <div className="bg-red-500 h-[2px] w-full"></div>
      </div>
    </li>
  );
};
