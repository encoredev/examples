import { api, StreamOut } from "encore.dev/api";

// Used to pass initial data.
interface LogHandshake {
  rows: number;
}

// What the server sends over the stream.
interface LogMessage {
  message: string;
}

// Use api.streamOut when you need to stream data out from your backend.
export const logStream = api.streamOut<LogHandshake, LogMessage>(
  { path: "/logs", expose: true },
  async (handshake, stream) => {
    try {
      for await (const message of mockedLogs(handshake.rows, stream)) {
        await stream.send({ message });
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  },
);

// This function generates an async iterator that yields mocked log rows
async function* mockedLogs(rows: number, stream: StreamOut<LogMessage>) {
  for (let i = 0; i < rows; i++) {
    yield new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(`Log row ${i + 1}`);
      }, 500);
    });
  }

  // Close the stream when all logs have been sent
  await stream.close();
}
