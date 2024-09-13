import { api, StreamInOut } from "encore.dev/api";
import log from "encore.dev/log";

// Map to hold all connected streams
const connectedStreams: Map<
  string,
  StreamInOut<PostMessage, ChatMessage>
> = new Map();

// Object sent from the client to the server when establishing a connection
interface HandshakeRequest {
  id: string;
}

// Object sent from the client to the server when posting a message
interface PostMessage {
  username: string;
  msg: string;
}

// Object sent from the server to the client when receiving a message
interface ChatMessage {
  userID: string;
  username: string;
  msg: string;
}

export const chat = api.streamInOut<HandshakeRequest, PostMessage, ChatMessage>(
  { expose: true, auth: false, path: "/chat" },
  async (handshake, stream) => {
    connectedStreams.set(handshake.id, stream);
    log.info("user connected", handshake);

    try {
      // The stream object is an AsyncIterator that yields incoming messages.
      // The loop will continue as long as the client keeps the connection open.
      for await (const chatMessage of stream) {
        for (const [key, val] of connectedStreams) {
          try {
            // Send the users message to all connected clients.
            await val.send({ ...chatMessage, userID: handshake.id });
          } catch (err) {
            // If there is an error sending the message, remove the client from the map.
            connectedStreams.delete(key);
            log.error("error sending", err);
          }
        }
      }
    } catch (err) {
      // If there is an error reading from the stream, remove the client from the map.
      connectedStreams.delete(handshake.id);
      log.error("stream error", err);
    }

    // When the client disconnects, remove them from the map.
    connectedStreams.delete(handshake.id);
  },
);
