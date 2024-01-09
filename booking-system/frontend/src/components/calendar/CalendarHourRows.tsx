import React, { FC } from "react";
import { format, parse } from "date-fns";
import getCurrentUTCDate from "../../lib/getCurrentUTCDate";

// 0, 1, 2, ..., 23
const hours = [...Array.from(Array(24).keys())];

export const CalendarHourRows: FC = () => {
  return (
    <div
      className="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100"
      // 48 = 24 hours * 2 (half hours)
      style={{ gridTemplateRows: "repeat(48, minmax(1.5rem, 1fr))" }}
    >
      <div className="row-end-1 h-7"></div>
      {hours.map((hour) => {
        const p = parse(hour.toString(), "H", getCurrentUTCDate());
        return (
          <React.Fragment key={hour}>
            <div>
              <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                {format(p, "HH:mm")}
              </div>
            </div>
            <div />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default CalendarHourRows;
