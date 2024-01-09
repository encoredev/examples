import React, { FC } from "react";
import { getDay, getHours, getMinutes, isSameDay } from "date-fns";
import getCurrentUTCDate from "../../lib/getCurrentUTCDate";

export const BookingCalendarTimeIndicator: FC<{ displayedDays: Date[] }> = ({
  displayedDays,
}) => {
  const today = displayedDays.find((day) => {
    return isSameDay(getCurrentUTCDate(), day);
  });

  if (!today) return null;

  return <TimeIndicator colStart={getDay(today)} />;
};

export const AdminCalendarTimeIndicator: FC<{ displayedDay: Date }> = ({
  displayedDay,
}) => {
  const isToday = isSameDay(getCurrentUTCDate(), displayedDay);

  if (!isToday) return null;

  return <TimeIndicator colStart={1} />;
};

const TimeIndicator: FC<{ colStart?: number }> = ({ colStart }) => {
  const utcDateNow = getCurrentUTCDate();
  const minutesFromMidnight =
    getHours(utcDateNow) * 60 + getMinutes(utcDateNow);

  return (
    <li
      className={`relative flex ${colStart ? "col-start-" + colStart : ""}`}
      style={{
        gridRow: minutesFromMidnight,
      }}
    >
      <div className="absolute inset-0 flex items-center">
        <div className="absolute bg-red-500 rounded-full h-[10px] w-[10px] -top-[5px]"></div>
        <div className="bg-red-500 h-[2px] w-full"></div>
      </div>
    </li>
  );
};
