import { api } from "encore.dev/api";

// Used to pass initial data.
interface UploadHandshake {
  user: string;
}

// What the clients sends over the stream.
interface DataChunk {
  data: string;
  done: boolean;
}

// Returned when the stream is done.
interface StreamEndResponse {
  success: boolean;
}

// Use api.streamIn when you need to stream data into your backend.
export const uploadStream = api.streamIn<
  UploadHandshake,
  DataChunk,
  StreamEndResponse
>({ path: "/upload", expose: true }, async (handshake, stream) => {
  const chunks: string[] = [];
  try {
    // Read all the data from the stream
    for await (const data of stream) {
      chunks.push(data.data);
      // Stop the stream if the client sends a "done" message
      if (data.done) break;
    }
  } catch (err) {
    console.error(`Upload error by ${handshake.user}:`, err);
    return { success: false };
  }
  console.log(`Upload complete by ${handshake.user}:`, chunks);
  return { success: true };
});
