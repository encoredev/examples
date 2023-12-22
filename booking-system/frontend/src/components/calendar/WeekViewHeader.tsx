import React, { FC } from "react";
import { format } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { BookingReducerProps } from "../../lib/bookingReducer";

const WeekViewHeader: FC<BookingReducerProps> = ({ state, dispatch }) => {
  const firstDayOfWeek = state.displayedDays[0];
  const monthAndYear = format(firstDayOfWeek, "MMMM yyyy");

  return (
    <header className="flex flex-none items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-50">
      <h1 className="text-base font-semibold leading-6 text-gray-900">
        <time dateTime={firstDayOfWeek.toDateString()}>{monthAndYear}</time>
      </h1>
      <div className="flex items-center">
        <div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
          <button
            type="button"
            onClick={() => dispatch({ type: "goToPrevWeek" })}
            className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
          >
            <span className="sr-only">Previous week</span>
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: "goToToday" })}
            className="hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
          >
            Today
          </button>
          <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
          <button
            type="button"
            onClick={() => dispatch({ type: "goToNextWeek" })}
            className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
          >
            <span className="sr-only">Next week</span>
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default WeekViewHeader;
