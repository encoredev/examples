import Client, { Local } from "./client.ts";

/**
 * Returns the Encore request client for either the local or staging environment.
 * If we are running the frontend locally we assume that our Encore backend is also running locally
 * and make requests to that, otherwise we use the staging client.
 */
const getRequestClient = () => {
  const isLocal =
    location.hostname === "localhost" || location.hostname === "127.0.0.1";
  const env = isLocal ? Local : window.location.origin;

  return new Client(env);
};

export default getRequestClient;
