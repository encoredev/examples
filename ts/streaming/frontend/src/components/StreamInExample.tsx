import getRequestClient from "../lib/getRequestClient.ts";
import { useEffect, useState } from "react";
import { streaming, StreamOut } from "../lib/client.ts";
import Button from "./Button.tsx";

function StreamInExample() {
  const [uploadState, setUploadState] = useState("Connecting");
  const [stream, setStream] =
    useState<StreamOut<streaming.DataChunk, streaming.StreamEndResponse>>();

  const addState = (state: string) => {
    setUploadState((prev) => prev + ` / ${state}`);
  };

  const startUpload = async () => {
    if (!stream) return;
    addState("Uploading");
    await mockedUploadStream(stream);
    // Use stream.response() to get the final message from the server before the stream has closed
    const endMessage = await stream.response();
    addState(endMessage.success ? "Success" : "Error");
  };

  useEffect(() => {
    const connect = async () => {
      // Create a new connection to the server
      const stream = await getRequestClient().streaming.uploadStream({
        user: "Simon",
      });
      stream.socket.on("open", () => addState("Connected"));
      stream.socket.on("close", () => addState("Disconnected"));
      setStream(stream);
    };
    connect();
    return () => stream?.close();
  }, []);

  return (
    <div className="flex flex-col space-y-4">
      <p>
        This example is making use of <code>api.streamIn</code> to simulate an
        upload from the client to the server.
      </p>
      <p>
        Streaming state: <span className="font-bold">{uploadState}</span>
      </p>
      <Button
        disabled={uploadState.includes("Uploading")}
        onClick={startUpload}
      >
        Start upload stream
      </Button>
    </div>
  );
}

export default StreamInExample;

// This function simulates an upload stream from the client to the server
const mockedUploadStream = async (
  stream: StreamOut<streaming.DataChunk, streaming.StreamEndResponse>,
): Promise<void> => {
  return new Promise((resolve) => {
    const chunks = ["1", "2", "3", "4", "5"];
    const sendChunk = async () => {
      setTimeout(async () => {
        const data = chunks.splice(0, 1)[0];
        const done = chunks.length === 0;
        // Send the chunk to the server
        await stream.send({ data, done });
        if (done) resolve();
        else sendChunk();
      }, 500);
    };
    sendChunk();
  });
};
