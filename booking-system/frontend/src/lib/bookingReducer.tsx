import React from "react";
import {
  addWeeks,
  eachDayOfInterval,
  endOfWeek,
  startOfWeek,
  subWeeks,
} from "date-fns";
import { booking } from "./client";
import getCurrentUTCDate from "./getCurrentUTCDate";

const getWeekDaysForDate = (date: Date) => {
  return eachDayOfInterval({
    start: startOfWeek(date, { weekStartsOn: 1 }),
    end: endOfWeek(date, { weekStartsOn: 1 }),
  });
};

export interface BookingState {
  events: booking.BookableSlot[];
  displayedDays: Date[];
  modalEvent?: booking.BookableSlot;
}

export type BookingAction =
  | {
      type: "setEvents";
      value: booking.BookableSlot[];
    }
  | {
      type: "goToNextWeek";
    }
  | {
      type: "goToPrevWeek";
    }
  | {
      type: "goToToday";
    }
  | {
      type: "showBookingModal";
      value: booking.BookableSlot;
    }
  | {
      type: "hideBookingModal";
    };

export type BookingDispatch = React.Dispatch<BookingAction>;

export type BookingReducerProps = {
  state: BookingState;
  dispatch: BookingDispatch;
};

export function bookingReducer(
  state: BookingState,
  action: BookingAction,
): BookingState {
  switch (action.type) {
    case "setEvents": {
      return { ...state, events: action.value };
    }

    case "goToNextWeek": {
      const firstDay = state.displayedDays[0];
      const displayedDays = getWeekDaysForDate(addWeeks(firstDay, 1));
      return { ...state, displayedDays };
    }

    case "goToPrevWeek": {
      const firstDay = state.displayedDays[0];
      const displayedDays = getWeekDaysForDate(subWeeks(firstDay, 1));
      return { ...state, displayedDays };
    }

    case "goToToday": {
      const displayedDays = getWeekDaysForDate(getCurrentUTCDate());
      return { ...state, displayedDays };
    }

    case "showBookingModal": {
      return { ...state, modalEvent: action.value };
    }

    case "hideBookingModal": {
      return { ...state, modalEvent: undefined };
    }
  }
}

export const useBookingReducer = () => {
  const [state, dispatch] = React.useReducer(bookingReducer, {
    displayedDays: getWeekDaysForDate(new Date()),
    events: [],
  });

  return { state, dispatch };
};
