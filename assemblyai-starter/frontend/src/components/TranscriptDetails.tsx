import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FC, MouseEventHandler } from "react";
import { Spinner } from "./Spinner";
import { UserIcon } from "./UserIcon";
import Client from "../lib/client";

const client = new Client(window.location.origin);

export const TranscriptDetails: FC<{
  id: string;
}> = ({ id }) => {
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["transcript", id],
    queryFn: () => client.backend.GetTranscript(id),
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: () => {
      return fetch(`${window.location.origin}/api/transcripts/${id}/sync`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["transcript", id] });
      queryClient.refetchQueries({ queryKey: ["transcripts"] });
    },
  });

  const handleSync: MouseEventHandler<HTMLButtonElement> = () => {
    mutation.mutate();
  };

  if (isLoading) {
    return <div className="container mx-auto px-4">Loading...</div>;
  } else if (error) {
    return (
      <div className="container mx-auto px-4 text-red-600">
        {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <header className="flex flex-col items-center my-16">
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mb-4">
          {data?.name}
        </h1>
        <p className="text-gray-400 mb-4">Transcript ID: {data?.id}</p>
        {mutation.isPending ? (
          <div className="center">
            <Spinner />
          </div>
        ) : (
          <>
            <button
              title="Manually retrieve the transcript from AssemblyAI."
              className="text-sm py-2 px-4 rounded-full border-0 text-sm font-semibold text-blue-800 border-solid border-2 border-blue-800 bg-transparent hover:bg-blue-50 hover:cursor-pointer"
              onClick={handleSync}
            >
              Sync
            </button>
            {mutation.isError ? (
              <div>An error occurred: {mutation.error.message}</div>
            ) : null}
          </>
        )}
      </header>
      {data?.status === "error" && (
        <p className="text-red-500 text-center">Failed to transcribe audio.</p>
      )}
      {data?.status === "queued" && (
        <p className="text-center">Transcript isn't ready yet.</p>
      )}
      {data?.status === "completed" &&
        data?.utterances?.map((utterance) => (
          <div className="mb-8 max-w-prose mx-auto">
            <div className="flex gap-4 mb-2 justify-between">
              <div className={"flex gap-2 text-gray-700"}>
                <UserIcon />
                <p>Speaker {utterance.speaker}</p>
              </div>
              <p className="text-gray-400">{secondsToTime(utterance.start)}</p>
            </div>
            <p className={"bg-gray-100 p-4 rounded-lg ml-8"}>
              {utterance.text}
            </p>
          </div>
        ))}
    </div>
  );
};

/**
 * Converts a duration in milliseconds to a HH:MM:SS string.
 *
 * @param milliseconds - The duration in milliseconds
 * @returns
 */
function secondsToTime(milliseconds: number) {
  const seconds = milliseconds / 1000;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}
