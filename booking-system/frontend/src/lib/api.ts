import getRequestClient from "./getRequestClient";
import { booking } from "./client";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";

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
      return resp.Slots || [];
    },
  };
};

export const scheduledEventsQuery = () => {
  return {
    queryKey: ["scheduledEvents"],
    queryFn: async () => await client.booking.ListBookings(),
  };
};

export const confirmBookingMutation = (onSuccess: () => void) => {
  const queryClient = useQueryClient();

  return {
    mutationFn: (params: booking.BookParams) => {
      return client.booking.Book({ ...params, start: params.start });
    },
    onSuccess: async () => {
      onSuccess();
      await queryClient.invalidateQueries({
        queryKey: ["bookableSlots"],
      });
    },
  };
};

export const deleteBookingMutation = (onSuccess: () => void) => {
  const queryClient = useQueryClient();

  return {
    mutationFn: (id: number) => {
      return client.booking.DeleteBooking(id);
    },
    onSuccess: async () => {
      onSuccess();
      await queryClient.invalidateQueries({ queryKey: ["scheduledEvents"] });
    },
  };
};
