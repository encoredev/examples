import React, { FC } from "react";
import { format, isSameDay } from "date-fns";
import { BookingReducerProps } from "../../lib/bookingReducer";
import getCurrentUTCDate from "../../lib/getCurrentUTCDate";

const WeekViewDaysRow: FC<BookingReducerProps> = ({ state }) => {
  return (
    <div className="sticky top-0 z-30 flex-none bg-white shadow ring-1 ring-black ring-opacity-5 pr-8">
      <div className="-mr-px grid grid-cols-7 divide-x divide-gray-100 border-r border-gray-100 text-sm leading-6 text-gray-500">
        <div className="col-end-1 w-14" />

        {state.displayedDays.map((day) => {
          const isToday = isSameDay(getCurrentUTCDate(), day);

          return (
            <div
              key={day.toString()}
              className="flex items-center justify-center py-3"
            >
              <span className="flex items-baseline">
                {format(day, "iii")}{" "}
                <span
                  className={`
                    flex items-center justify-center font-semibold h-8 w-8
                    ${
                      isToday
                        ? "rounded-full bg-indigo-600 text-white ml-1.5"
                        : "text-gray-900"
                    }
                  `}
                >
                  {format(day, "d")}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekViewDaysRow;
