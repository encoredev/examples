import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeEventHandler, FC, FormEventHandler, useState } from "react";
import { Spinner } from "./Spinner";
import Client from "../lib/client";

const client = new Client(window.location.origin);

export const UploadAudioForm: FC<{}> = () => {
  const queryClient = useQueryClient();

  const [file, setFile] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: (file: File) => {
      const data = new FormData();
      data.append("file", file);
      return fetch(`${window.location.origin}/api/upload`, {
        method: "POST",
        body: data,
      });
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["transcripts"] });
    },
  });

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (file) {
      mutation.mutate(file);
    }
  };

  return (
    <div className="px-4 py-8">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center flex-col gap-2">
          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            className="
              block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:text-blue-800 file:border-solid file:border-2 file:border-blue-800 file:bg-transparent
              hover:file:bg-blue-50 hover:file:cursor-pointer"
          />
          {mutation.isPending ? (
            <div className="center">
              <Spinner />
            </div>
          ) : (
            <>
              <button
                type="submit"
                className="block w-full bg-blue-800 text-blue-50 py-2 px-4 rounded-full hover:cursor-pointer hover:bg-blue-900"
              >
                Upload
              </button>
              {mutation.isError ? (
                <div>An error occurred: {mutation.error.message}</div>
              ) : null}
            </>
          )}
        </div>
      </form>
    </div>
  );
};
