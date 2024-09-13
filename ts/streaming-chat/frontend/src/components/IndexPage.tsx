import { useState } from "react";
import { useNavigate } from "react-router-dom";

function IndexPage() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const onJoin = () => {
    if (!name) return;
    const query = new URLSearchParams({ name });
    navigate(`/chat?${query}`);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center p-6">
      <div className="p-10">
        <h1 className="text-4xl mb-4">Encore.ts Streaming Chat Example</h1>
        <p className="text-center mb-1">
          Simple chat application showcasing how to use Encore.ts{" "}
          <a
            href="https://encore.dev/docs/ts/primitives/streaming-apis"
            className="underline"
          >
            WebSocket streaming API
          </a>
          .
        </p>
        <p className="text-center">
          View the full code in the{" "}
          <a
            href="https://github.com/encoredev/examples/tree/main/ts"
            className="underline"
          >
            example repo on GitHub
          </a>
          .
        </p>
      </div>
      <form onSubmit={onJoin} className="flex space-x-4 items-center">
        <input
          type="text"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="px-4 py-2 text-lg rounded border border-black/20"
        />
        <button
          className="border border-black rounded px-4 py-2 w-fit transition hover:bg-black/5"
          type="submit"
        >
          Join chat
        </button>
      </form>
    </div>
  );
}

export default IndexPage;
