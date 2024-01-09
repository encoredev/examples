import React, { FC, useState } from "react";
import { Dialog } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/solid";
import Modal from "./Modal";
import { booking } from "../lib/client";
import { useMutation } from "@tanstack/react-query";
import EventDetails from "./EventDetails";
import { confirmBookingMutation } from "../lib/api";

const BookingModal: FC<{
  event?: booking.BookableSlot;
  setClose: () => void;
}> = ({ event, setClose }) => {
  const [isBooked, setIsBooked] = useState(false);
  const onClose = () => {
    setIsBooked(false);
    setClose();
  };

  const confirmBooking = useMutation(
    confirmBookingMutation(() => setIsBooked(true)),
  );

  return (
    <Modal open={!!event} setOpen={setClose}>
      {event && (
        <>
          {isBooked ? (
            <BookingConfirmation event={event} onClose={onClose} />
          ) : (
            <BookingForm
              event={event}
              onClose={onClose}
              onConfirm={confirmBooking.mutate}
            />
          )}
        </>
      )}
    </Modal>
  );
};

export default BookingModal;

const BookingForm: FC<{
  event: booking.BookableSlot;
  onClose: () => void;
  onConfirm: (params: booking.BookParams) => void;
}> = ({ event, onClose, onConfirm }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const disableButton = !name || !email;

  return (
    <>
      <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
            <Dialog.Title
              as="h3"
              className="text-lg font-semibold leading-6 text-gray-900"
            >
              Enter Details
            </Dialog.Title>

            <div className="mt-4 w-full">
              <EventDetails event={event} />

              <form className="space-y-4 mt-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      name="name"
                      id="name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="John Smith"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      name="email"
                      id="email"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-4 py-3 mt-4 sm:flex sm:flex-row-reverse sm:px-6">
        <button
          type="button"
          disabled={disableButton}
          className={`
            inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto
            ${disableButton ? "opacity-50 cursor-not-allowed" : ""}
          `}
          onClick={() => onConfirm({ Email: email, start: event.start })}
        >
          Schedule Event
        </button>
        <button
          type="button"
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </>
  );
};

const BookingConfirmation: FC<{
  event: booking.BookableSlot;
  onClose: () => void;
}> = ({ event, onClose }) => {
  return (
    <div className="px-4 pb-4 pt-5 sm:p-6">
      <div>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
        </div>
        <div className="mt-3 flex flex-col items-center text-center sm:mt-5">
          <Dialog.Title
            as="h3"
            className="text-lg font-semibold leading-6 text-gray-900"
          >
            You are scheduled
          </Dialog.Title>

          <div className="mt-2">
            <p className="text-sm text-gray-500">
              A calendar invitation has been sent to your email address.
            </p>
          </div>

          <div className="flex flex-col mt-4 border border-gray-300 rounded p-4 w-full">
            <EventDetails event={event} />
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-6">
        <button
          type="button"
          className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};
