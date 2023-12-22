import React, { FC } from "react";
import { getHours, getMinutes, parse } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { availabilityQuery } from "../../lib/api";

const END_OF_DAY = "1440"; // 24 hours * 60 minutes

const getMinutesFromMidnight = (time: Date) => {
  return getHours(time) * 60 + getMinutes(time);
};

const WeekViewAvailability: FC = () => {
  const { data: availability, error: fetchError } =
    useQuery(availabilityQuery());

  if (!availability) return null;

  return (
    <>
      {availability.map(({ start, end }, index) => {
        const dayIndex = index + 1;

        if (!start || !end) {
          // Unavailable all day
          return (
            <Unavailable
              key={dayIndex}
              day={dayIndex}
              gridRow={`1 / span ${END_OF_DAY}`}
            />
          );
        }

        const startDate = parse(`${dayIndex} ${start}`, "i HH:mm", new Date());
        const endDate = parse(`${dayIndex} ${end}`, "i HH:mm", new Date());

        return (
          <React.Fragment key={startDate.toDateString()}>
            <Unavailable
              key={startDate.toString()}
              day={dayIndex}
              gridRow={`1 / span ${getMinutesFromMidnight(startDate)}`}
            />

            <Unavailable
              key={endDate.toString()}
              day={dayIndex}
              gridRow={`${getMinutesFromMidnight(
                endDate,
              )} / span ${END_OF_DAY}`}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};

export default WeekViewAvailability;

const Unavailable: FC<{ day: number; gridRow: string }> = ({
  day,
  gridRow,
}) => {
  return (
    <li className={`relative mt-px flex col-start-${day}`} style={{ gridRow }}>
      <div
        className="group absolute inset-1 flex flex-col overflow-y-auto p-2 bg-repeat bg-contain"
        style={{ backgroundImage: "url(/frontend/unavailable-bg.svg)" }}
      />
    </li>
  );
};
