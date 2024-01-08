import React, { FC, useEffect, useState } from "react";
import { format, parse } from "date-fns";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { APIError, booking } from "../../lib/client";
import {
  Form,
  LoaderFunctionArgs,
  useActionData,
  useRouteError,
  useSubmit,
} from "react-router-dom";
import { availabilityQuery, setAvailability } from "../../lib/api";

export const action =
  (queryClient: QueryClient) =>
  async ({ request }: LoaderFunctionArgs) => {
    const json = (await request.json()) as booking.Availability[];
    await setAvailability(json);
    await queryClient.invalidateQueries({ queryKey: ["availability"] });
    return { ok: true, saved: true };
  };

const AvailabilitySettingsPage: FC = () => {
  const submit = useSubmit();
  const error = useRouteError() as APIError | undefined;
  const { data } = useQuery(availabilityQuery());
  const actionData = useActionData() as { saved: boolean } | undefined;
  const [availability, setAvailability] = useState<booking.Availability[]>([]);

  useEffect(() => {
    if (!data) return;
    setAvailability(data);
  }, [data]);

  const onChange = (availability: booking.Availability, dayIndex: number) => {
    setAvailability((prev) => {
      return [
        ...prev.slice(0, dayIndex),
        availability,
        ...prev.slice(dayIndex + 1, prev.length),
      ];
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold leading-6 text-gray-900">
        Weekly hours
      </h2>

      <Form
        method="post"
        onSubmit={(event) => {
          event.preventDefault();
          submit(JSON.stringify(availability), {
            method: "POST",
            encType: "application/json",
          });
        }}
      >
        <ul className="space-y-2 mt-4">
          {availability.map((availability, idx) => {
            const date = parse((idx + 1).toString(), "i", new Date());
            const isAvailable = !!availability.start || !!availability.end;

            return (
              <li key={idx} className="flex items-center h-10">
                <div className="w-10">
                  <input
                    checked={isAvailable}
                    onChange={(event) => {
                      const isAvailable = event.target.checked;
                      onChange(
                        {
                          ...availability,
                          start: isAvailable ? "08:00" : undefined,
                          end: isAvailable ? "18:00" : undefined,
                        },
                        idx,
                      );
                    }}
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>

                <div className="w-14">
                  <span className="font-semibold">{format(date, "EEE")}</span>
                </div>

                <div className="flex items-center space-x-2">
                  {isAvailable ? (
                    <>
                      <input
                        type="text"
                        value={availability.start}
                        onChange={(event) => {
                          const start = event.target.value;
                          onChange({ ...availability, start }, idx);
                        }}
                        required
                        className="block w-20 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <span>-</span>
                      <input
                        type="text"
                        value={availability.end}
                        onChange={(event) => {
                          const end = event.target.value;
                          onChange({ ...availability, end }, idx);
                        }}
                        required
                        className="block w-20 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </>
                  ) : (
                    <span className="text-gray-400">Unavailable</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {error && <p className="mt-4 text-sm text-red-600">{error.message}</p>}

        {actionData?.saved && (
          <p className="mt-4 text-sm text-green-600">
            Settings saved successfully
          </p>
        )}

        <button
          type="submit"
          className={`
            mt-4 inline-flex w-fit justify-center rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500
          `}
        >
          Save
        </button>
      </Form>
    </div>
  );
};

export default AvailabilitySettingsPage;
