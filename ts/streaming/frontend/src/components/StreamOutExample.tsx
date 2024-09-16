import getRequestClient from "../lib/getRequestClient.ts";
import { useState } from "react";
import Button from "./Button.tsx";

function StreamOutExample() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const startStream = async () => {
    // Start the stream by listen for messages
    const stream = await getRequestClient().streaming.logStream({ rows: 10 });
    stream.socket.on("open", () => {
      setLogs([]);
      setIsStreaming(true);
    });
    stream.socket.on("close", () => setIsStreaming(false));

    for await (const message of stream) {
      setLogs((prev) => [...prev, message.message]);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <p>
        This example is making use of <code>api.streamOut</code> to get a log
        stream from the backend.
      </p>

      <Button disabled={isStreaming} onClick={startStream}>
        Start log stream
      </Button>
      <div>
        <span className="font-bold">Logs:</span>
        {logs.map((log, i) => (
          <p key={i}>{log}</p>
        ))}
        {!!logs.length && !isStreaming && <p>Stream is done</p>}
      </div>
    </div>
  );
}

export default StreamOutExample;
