import getRequestClient from "../lib/getRequestClient.ts";
import { chat } from "../lib/client.ts";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SendIcon from "./SendIcon.tsx";
import { v4 as uuidv4 } from "uuid";

function Chat() {
  const [queryParams] = useSearchParams();
  const username = queryParams.get("name") ?? "Anonymous";

  const stream =
    useRef<Awaited<ReturnType<typeof chat.ServiceClient.prototype.chat>>>();

  const [userID] = useState<string>(uuidv4());
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<chat.ChatMessage[]>([]);
  const [userInput, setUserInput] = useState<string>("");

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stream.current || loading) return;
    stream.current.send({ msg: userInput, username });
    setUserInput("");
  };

  useEffect(() => {
    const connect = async () => {
      setLoading(true);
      stream.current = await getRequestClient().chat.chat({ id: userID });
      stream.current.socket.on("close", connect);
      stream.current.socket.on("open", () => setLoading(false));

      for await (const msg of stream.current) {
        setMessages((prevState) => {
          return [...prevState, msg];
        });
      }
    };

    connect();
    return () => {
      stream.current?.socket.off("close", connect);
      stream.current?.close();
    };
  }, []);

  return (
    <div className="flex h-[calc(100vh-120px)] items-center justify-center w-full">
      <div className="bg-gray-100 h-full flex flex-col w-full max-w-4xl mx-auto">
        <header className="flex items-center justify-between p-4 bg-white border-b">
          <h1 className="text-lg font-bold">Chat Room</h1>
          <div className="flex items-center space-x-2">
            {loading ? (
              <>
                <figure className="animate-pulse bg-blue-500 h-3 w-3 rounded-full" />
                <span className="block text-sm">Connecting...</span>
              </>
            ) : (
              <>
                <figure className="bg-green-500 h-3 w-3 rounded-full" />
                <span className="block text-sm">{username}</span>
              </>
            )}
          </div>
        </header>
        <div className="relative flex-1 overflow-y-auto p-4 pt-6">
          <div className="flex flex-col space-y-3">
            {messages.map((msg, i) => {
              const isMe = userID === msg.userID;
              return (
                <div
                  key={i}
                  className={`flex ${isMe ? "justify-end" : "justify-start pt-4"}`}
                >
                  <div
                    className={`text-black relative p-2 rounded-lg max-w-xs ${isMe ? "bg-blue-200" : "bg-gray-300"}`}
                  >
                    {!isMe && (
                      <span className="font-bold text-sm absolute bg-gray-300 rounded px-1.5 -top-3 left-0">
                        {msg.username}
                      </span>
                    )}
                    <span>{msg.msg}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={sendMessage} className="bg-white p-4 flex items-center">
          <input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            type="text"
            placeholder="Type your message..."
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
          />
          <button className="bg-blue-500 text-white rounded-full p-2 ml-2 hover:bg-blue-600 focus:outline-none">
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
