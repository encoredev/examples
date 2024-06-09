import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { StatusBadge } from "./StatusBadge";
import Client from "../lib/client";

const client = new Client(window.location.origin);

export const TranscriptList: FC<{
  selected: string | undefined;
  onSelect: (id: string) => void;
}> = ({ selected, onSelect }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["transcripts"],
    queryFn: () => client.backend.GetTranscriptions(),
    refetchInterval: 10000, // 10s
    retry: false,
  });

  return (
    <div className="flex flex-col overflow-y-auto">
      <h2 className="text-xl font-semibold text-gray-900 p-4">Conversations</h2>
      {isLoading && <div className="p-4">Loading...</div>}
      {error && (
        <div className="p-4 text-red-600">{(error as Error).message}</div>
      )}
      {data?.transcriptions?.map((transcript) => {
        return (
          <article
            key={transcript.id}
            onClick={() => onSelect(transcript.id)}
            className={
              "flex items-center mx-2 p-2 text-sm justify-between hover:cursor-pointer rounded-lg " +
              (selected === transcript.id
                ? "bg-gray-200 hover:bg-gray-200"
                : "hover:bg-gray-200")
            }
          >
            <div>
              <span className="text-gray-950 truncate">{transcript.name}</span>
              <div className="text-gray-500">
                {Intl.DateTimeFormat("en-US", {
                  dateStyle: "medium",
                  timeStyle: "medium",
                }).format(new Date(transcript.submitted_at))}
              </div>
            </div>
            <StatusBadge status={transcript.status} />
          </article>
        );
      })}
    </div>
  );
};
