import Client, { Local } from "./client.ts";

/**
 * Returns the generated Encore request client for either the local or staging environment.
 * If we are running the frontend locally we assume that our Encore backend is also running locally.
 */
const getRequestClient = (token: string | undefined) => {
  const isLocal =
    location.hostname === "localhost" || location.hostname === "127.0.0.1";
  const env = isLocal ? Local : window.location.origin;

  return new Client(env, {
    auth: { authorization: token || "" },
  });
};

export default getRequestClient;
