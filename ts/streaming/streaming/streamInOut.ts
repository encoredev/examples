import { api } from "encore.dev/api";

// Object sent from the client to the server when establishing a connection
interface HandshakeRequest {
  model: string;
}

// Object sent from the client to the server when posting a message
interface InMessage {
  prompt: string;
}

// Object sent from the server to the client when receiving a message
interface OutMessage {
  message: string;
  done: boolean;
}

// Use api.streamInOut when you need to stream data in and out of your backend.
export const aiChatStream = api.streamInOut<
  HandshakeRequest,
  InMessage,
  OutMessage
>(
  { expose: true, auth: false, path: "/ai-chat" },
  async (handshake, stream) => {
    try {
      // The stream object is an AsyncIterator that yields incoming messages.
      // The loop will continue as long as the client keeps the connection open.
      for await (const userMessage of stream) {
        for await (const aiMessage of getMockedAiMessage(userMessage)) {
          // Send the AI's response to the client
          await stream.send(aiMessage);
        }
      }
    } catch (err) {
      console.error(`${handshake.model} encountered an error:`, err);
    }
  },
);

// This function generates an async iterator that yields the mocked AI's response
async function* getMockedAiMessage(message: InMessage) {
  const reversedMessage = message.prompt.split("").reverse().join("");
  const response = `The reversed of what you just wrote is: ${reversedMessage}`;
  for (let i = 0; i <= response.length; i++) {
    yield new Promise<OutMessage>((resolve) => {
      setTimeout(() => {
        if (i <= response.length) {
          resolve({
            message: response.substring(0, i),
            done: i >= response.length,
          });
        }
      }, 50);
    });
  }
}
