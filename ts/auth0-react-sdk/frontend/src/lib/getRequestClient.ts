import Client, { Environment, Local } from "./client.ts";

/**
 * Returns the generated Encore request client for either the local or staging environment.
 * If we are running the frontend locally (development) we assume that our Encore
 * backend is also running locally.
 */
const getRequestClient = (token: string | undefined) => {
  const env = import.meta.env.DEV ? Local : Environment("staging");

  return new Client(env, {
    auth: { authorization: token || "" },
  });
};

export default getRequestClient;
