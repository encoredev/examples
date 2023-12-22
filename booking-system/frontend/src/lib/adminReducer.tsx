import React from "react";
import { add, sub } from "date-fns";
import { booking } from "./client";

export interface AdminState {
  events: booking.Booking[];
  displayedDay: Date;
}

export type AdminAction =
  | {
      type: "setEvents";
      value: booking.Booking[];
    }
  | {
      type: "goToNextDay";
    }
  | {
      type: "goToPrevDay";
    }
  | {
      type: "goToToday";
    }
  | {
      type: "setDay";
      value: Date;
    };

export type AdminDispatch = React.Dispatch<AdminAction>;

export type AdminReducerProps = {
  state: AdminState;
  dispatch: AdminDispatch;
};

export function adminReducer(
  state: AdminState,
  action: AdminAction,
): AdminState {
  switch (action.type) {
    case "setEvents": {
      return { ...state, events: action.value };
    }

    case "goToNextDay": {
      const displayedDay = add(state.displayedDay, { days: 1 });
      return { ...state, displayedDay };
    }

    case "goToPrevDay": {
      const displayedDay = sub(state.displayedDay, { days: 1 });
      return { ...state, displayedDay };
    }

    case "goToToday": {
      return { ...state, displayedDay: new Date() };
    }

    case "setDay": {
      return { ...state, displayedDay: action.value };
    }
  }
}

export const useAdminReducer = () => {
  const [state, dispatch] = React.useReducer(adminReducer, {
    displayedDay: new Date(),
    events: [],
  });

  return { state, dispatch };
};
