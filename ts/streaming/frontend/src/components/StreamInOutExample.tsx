import getRequestClient from "../lib/getRequestClient.ts";
import { FC, FormEvent, useEffect, useRef, useState } from "react";
import { streaming } from "../lib/client.ts";
import SendIcon from "./SendIcon.tsx"; // The type of the return value of the stream after awaited

// The type of the return value of the stream after awaited
type StreamReturnType = Awaited<
  ReturnType<typeof streaming.ServiceClient.prototype.aiChatStream>
>;

// The type of the message that is sent shown on the page
type Message = {
  user: boolean; // Is this message from the user or the AI
  text: string;
};

function StreamOutExample() {
  const stream = useRef<StreamReturnType>();

  const [isStreaming, setIsStreaming] = useState<null | boolean>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingMessage, setStreamingMessage] =
    useState<streaming.OutMessage>({ message: "", done: false });
  const [userInput, setUserInput] = useState<string>("");

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stream.current) return;
    setMessages((prev) => [...prev, { user: true, text: userInput }]);
    // Send the user's message to the server
    stream.current.send({ prompt: userInput });
    setUserInput("");
  };

  useEffect(() => {
    const connect = async () => {
      stream.current = await getRequestClient().streaming.aiChatStream({
        model: "gpt-fake",
      });
      stream.current.socket.on("open", () => setIsStreaming(false));

      for await (const msg of stream.current) {
        setStreamingMessage(msg);
        if (msg.done) {
          setStreamingMessage({ message: "", done: false });
          setMessages((prev) => [...prev, { user: false, text: msg.message }]);
        }
      }

      // If the above loop ends, it means the stream has closed
      setIsStreaming(null);
    };

    connect();
    return () => {
      stream.current?.close();
    };
  }, []);

  return (
    <div className="flex flex-col w-full text-center space-y-2">
      <p>
        This example is making use of <code>api.streamInOut</code> to simulate a
        bidirectional AI Chat stream.
      </p>
      <div className="flex h-[calc(100vh-150px)] items-center justify-center w-full text-left">
        <div className="bg-gray-100 h-full flex flex-col w-full max-w-4xl mx-auto">
          <header className="flex items-center justify-between p-4 bg-white border-b">
            <h1 className="text-lg font-bold">Fake AI Chat</h1>
            <div className="flex items-center space-x-2">
              {isStreaming === null ? (
                <>
                  <figure className="animate-pulse bg-blue-500 h-3 w-3 rounded-full" />
                  <span className="block text-sm">Connecting...</span>
                </>
              ) : (
                <figure className="bg-green-500 h-3 w-3 rounded-full" />
              )}
            </div>
          </header>
          <div className="relative flex-1 overflow-y-auto p-4 pt-6">
            <div className="flex flex-col space-y-3">
              {messages.map(({ user, text }, i) => {
                return <ChatBubble key={i} user={user} text={text} />;
              })}
              {streamingMessage.message && (
                <ChatBubble user={false} text={streamingMessage.message} />
              )}
            </div>
          </div>

          <form
            onSubmit={sendMessage}
            className="bg-white p-4 flex items-center"
          >
            <input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              type="text"
              placeholder="Type your message..."
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
            />
            <button
              disabled={!!isStreaming}
              className="bg-blue-500 text-white rounded-full p-2 ml-2 hover:bg-blue-600 focus:outline-none"
            >
              <SendIcon />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StreamOutExample;

const ChatBubble: FC<{ user: boolean; text: string }> = ({ user, text }) => {
  return (
    <div className={`flex ${user ? "justify-end" : "justify-start pt-4"}`}>
      <div
        className={`text-black relative p-2 rounded-lg max-w-xs ${
          user ? "bg-blue-200" : "bg-gray-300"
        }`}
      >
        <span>{text}</span>
      </div>
    </div>
  );
};
