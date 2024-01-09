import { FC, useEffect, useState } from "react";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday as isTodayFns,
  parse,
  startOfToday,
  startOfWeek,
} from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { AdminReducerProps } from "../../lib/adminReducer";
import { useQuery } from "@tanstack/react-query";
import { scheduledEventsQuery } from "../../lib/api";

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

const MonthViewCalendar: FC<AdminReducerProps> = ({ state, dispatch }) => {
  const { data: scheduledEvents } = useQuery(scheduledEventsQuery());
  const eventArray = scheduledEvents?.bookings.flatMap((b) => b.start) || [];

  const today = startOfToday();
  const [currMonth, setCurrMonth] = useState(() => format(today, "MMM-yyyy"));
  let firstDayOfMonth = parse(currMonth, "MMM-yyyy", new Date());

  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(firstDayOfMonth, { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(firstDayOfMonth), { weekStartsOn: 1 }),
  });

  const getPrevMonth = () => {
    const firstDayOfPrevMonth = add(firstDayOfMonth, { months: -1 });
    setCurrMonth(format(firstDayOfPrevMonth, "MMM-yyyy"));
  };

  const getNextMonth = () => {
    const firstDayOfNextMonth = add(firstDayOfMonth, { months: 1 });
    setCurrMonth(format(firstDayOfNextMonth, "MMM-yyyy"));
  };

  useEffect(() => {
    setCurrMonth(format(state.displayedDay, "MMM-yyyy"));
  }, [state.displayedDay]);

  return (
    <div className="select-none">
      <div className="flex items-center text-center text-gray-900">
        <ChevronLeftIcon
          className="h-5 w-5 flex flex-none items-center justify-center text-gray-400 hover:text-gray-500 cursor-pointer"
          onClick={getPrevMonth}
        />
        <p className="flex-auto text-sm font-semibold">
          {format(firstDayOfMonth, "MMMM yyyy")}
        </p>
        <ChevronRightIcon
          className="h-5 w-5 flex flex-none items-center justify-center text-gray-400 hover:text-gray-500 cursor-pointer"
          onClick={getNextMonth}
        />
      </div>

      <div className="mt-6 grid grid-cols-7 text-center text-xs leading-6 text-gray-500">
        {[1, 2, 3, 4, 5, 6, 7].map((day, idx) => {
          const date = parse(day.toString(), "i", new Date());
          return (
            <div key={idx} className="font-semibold">
              {format(date, "EEEEE")}
            </div>
          );
        })}
      </div>

      <div className="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200">
        {daysInMonth.map((day, dayIdx) => {
          const isSelected = isSameDay(day, state.displayedDay);
          const isCurrentMonth = isSameMonth(day, firstDayOfMonth);
          const isToday = isTodayFns(day);
          const hasEvent = eventArray.some((e) => isSameDay(new Date(e), day));

          return (
            <button
              key={dayIdx}
              type="button"
              onClick={() => dispatch({ type: "setDay", value: day })}
              className={classNames(
                "relative py-1.5 hover:bg-gray-100 focus:z-10",
                isCurrentMonth ? "bg-white" : "bg-gray-50",
                isSelected || (isToday && "font-semibold"),
                isSelected && "text-white",
                !isSelected && isCurrentMonth && !isToday && "text-gray-900",
                !isSelected && !isCurrentMonth && !isToday && "text-gray-400",
                isToday && !isSelected && "text-indigo-600",
                dayIdx === 0 && "rounded-tl-lg",
                dayIdx === 6 && "rounded-tr-lg",
                dayIdx === daysInMonth.length - 7 && "rounded-bl-lg",
                dayIdx === daysInMonth.length - 1 && "rounded-br-lg",
              )}
            >
              <time
                dateTime={day.toISOString()}
                className={classNames(
                  "mx-auto flex h-7 w-7 items-center justify-center rounded-full",
                  isSelected && isToday && "bg-indigo-600",
                  isSelected && !isToday && "bg-gray-900",
                )}
              >
                {format(day, "d")}
              </time>

              {hasEvent && (
                <figure className="absolute bottom-1 right-1 h-[5px] w-[5px] rounded-full bg-gray-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MonthViewCalendar;
