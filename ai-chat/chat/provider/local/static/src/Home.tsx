import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { FC, useEffect, useState } from "react";
import { humanId } from "human-id";
import poweredBy from "./assets/powered-by-encore.png";
import Button from "./components/Button";
import Client, { Local, local } from "./client";

const apiURL = import.meta.env.DEV
  ? Local
  : window.location.protocol + "//" + window.location.host;

const client = new Client(apiURL);

export const Home: FC<{}> = () => {
  let [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [botsLive, setBotsLive] = useState<local.BotInfo[]>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [channelID, setChannelID] = useState(searchParams.get("channel") || "");

  async function joinChat() {
    setIsSubmitting(true);
    const channel = channelID.replaceAll(" ", "-").toLowerCase();
    navigate({
      pathname: "/chat",
      search: createSearchParams({
        name: username,
        channel:
          channel ||
          humanId({ adjectiveCount: 0, capitalize: false, separator: "-" }),
      }).toString(),
    });
  }

  useEffect(() => {
    client.local
      .ListBots()
      .then((resp) => {
        setBotsLive(resp.bots);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="relative isolate overflow-hidden bg-gray-900 min-h-screen">
      <svg
        className="absolute inset-0 -z-10 h-full w-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
            width={200}
            height={200}
            x="50%"
            y={-1}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <svg x="50%" y={-1} className="overflow-visible fill-gray-800/20">
          <path
            d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
            strokeWidth={0}
          />
        </svg>
        <rect
          width="100%"
          height="100%"
          strokeWidth={0}
          fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)"
        />
      </svg>
      <div
        className="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]"
        aria-hidden="true"
      >
        <div
          className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-20"
          style={{
            clipPath:
              "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
          }}
        />
      </div>
      <div className="mx-auto max-w-4xl px-6 py-16 pb-24 sm:py-40">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-[#fff] sm:text-6xl lg:col-span-2">
          Chatty Bots
        </h1>
        <div className="flex flex-col space-x-0 pt-10 md:flex-row md:space-x-10">
          <div>
            <p className="text-lg leading-8 text-gray-600">
              Create and chat with AI bots boasting unique personalities. Dive
              into engaging conversations with custom-designed virtual
              companions tailored to entertain, inform, and delight. <br />
              <br />
              Found some bots you love? Add them to your Discord or Slack!
            </p>
            <form
              className="flex flex-col space-y-3 items-start w-full mt-10"
              onSubmit={(event) => {
                event.preventDefault();
                joinChat();
              }}
            >
              <div>
                <input
                  type="text"
                  placeholder="Your name"
                  className="max-w-72 text-xl block w-full rounded-md border-gray-500 bg-gray-800 focus:ring-0 focus:border-gray-500"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Topic (optional)"
                  className="max-w-72 text-xl block rounded-md border-gray-500 bg-gray-800 focus:ring-0 focus:border-gray-500"
                  value={channelID}
                  onChange={(e) => setChannelID(e.target.value)}
                />
              </div>
              <div>
                <Button
                  mode="light"
                  size="lg"
                  type="submit"
                  disabled={!username || isSubmitting}
                >
                  <span className="hidden sm:inline">Join Chat</span>
                  <span className="inline sm:hidden">Join Chat</span>
                </Button>
              </div>
            </form>
          </div>

          <div className="flex flex-col h-fit rounded-xl bg-white/5 p-6 ring-1 ring-inset ring-white/10 mt-10 min-w-fit w-full md:mt-0 sm:w-fit">
            <div>
              <dt className="truncate text-sm font-medium text-white opacity-50">
                Bots live right now
              </dt>
              <dd className="mt-1 flex items-center space-x-2 text-3xl font-semibold tracking-tight">
                <span className="text-white">{botsLive.length || "-"}</span>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green"></span>
                </span>
              </dd>
            </div>

            <div className="isolate flex items-center -space-x-2 mt-6">
              {botsLive.slice(0, 4).map((bot) => {
                return (
                  <img
                    key={bot.avatar + bot.name}
                    className="relative z-30 inline-block h-10 w-10 rounded-full ring-2 ring-white"
                    src={bot.avatar}
                    alt={bot.name}
                  />
                );
              })}
              {botsLive.length - 4 > 0 && (
                <span className="font-bold text-sm pl-5">
                  +{botsLive.length - 4}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 max-w-52 md:bottom-4 md:left-4">
        <a href="https://github.com/encoredev/encore" target="_blank">
          <img
            src={poweredBy}
            alt="Powered by Encore"
            className="block mx-auto"
          />
        </a>
      </div>
    </div>
  );
};
