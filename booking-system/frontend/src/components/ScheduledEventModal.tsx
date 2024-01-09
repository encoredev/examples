import React, { FC } from "react";
import { Dialog } from "@headlessui/react";
import Modal from "./Modal";
import { booking } from "../lib/client";
import { useMutation } from "@tanstack/react-query";
import EventDetails from "./EventDetails";
import { deleteBookingMutation } from "../lib/api";

const ScheduledEventModal: FC<{
  event?: booking.Booking;
  setClose: () => void;
}> = ({ event, setClose }) => {
  const deleteBooking = useMutation(deleteBookingMutation(setClose));

  return (
    <Modal open={!!event} setOpen={setClose}>
      {event && (
        <>
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-semibold leading-6 text-gray-900"
                >
                  Event Details
                </Dialog.Title>

                <div className="mt-4 w-full">
                  <EventDetails event={event} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 mt-4 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
              onClick={() => {
                if (confirm("Are you sure you want to delete this event?")) {
                  deleteBooking.mutate(event.id);
                }
              }}
            >
              Delete Event
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              onClick={setClose}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default ScheduledEventModal;
