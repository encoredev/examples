import getRequestClient from "./getRequestClient";
import { booking } from "./client";
import { format } from "date-fns";

const client = getRequestClient();

export const shiftAvailabilityArray = (arr: booking.Availability[]) => {
  // Put Sunday at the back of the array
  return [...arr.slice(1), arr[0]];
};

export const unshiftAvailabilityArray = (arr: booking.Availability[]) => {
  // Put sunday at the front of the array
  return [arr[arr.length - 1], ...arr.slice(0, arr.length - 1)];
};

const getAvailability = async (): Promise<booking.Availability[]> => {
  const resp = await client.booking.GetAvailability();
  return shiftAvailabilityArray(resp.Availability);
};

export const setAvailability = async (
  availability: booking.Availability[],
): Promise<void> => {
  return await client.booking.SetAvailability({
    Availability: unshiftAvailabilityArray(availability),
  });
};

export const availabilityQuery = () => ({
  queryKey: ["availability"],
  queryFn: async (): Promise<booking.Availability[]> => getAvailability(),
});

export const bookableSlotsQuery = (date: Date) => {
  const dateStr = format(date, "yyyy-MM-dd");
  return {
    queryKey: ["bookableSlots", dateStr],
    queryFn: async (): Promise<booking.BookableSlot[]> => {
      const resp = await client.booking.GetBookableSlots(dateStr);
      return (
        resp.Slots.map(({ start, end }) => ({
          start: start.split("Z")[0],
          end: end.split("Z")[0],
        })) || []
      );
    },
  };
};

export const scheduledEventsQuery = () => {
  return {
    queryKey: ["scheduledEvents"],
    queryFn: async () => await client.booking.ListBookings(),
  };
};
