import { cookies } from "next/headers";
import Client, { Environment } from "./client";

/**
 * Returns the Encore request client for either the local or staging environment.
 * If we are running the frontend locally (development) we assume that our Encore backend is also running locally
 * and make requests to that, otherwise we use the staging client.
 */
const getRequestClient = () => {
  const token = cookies().get("auth-token")?.value || "";
  const env =
    process.env.NODE_ENV === "development"
      ? "http://127.0.0.1:4000"
      : Environment("staging");

  return new Client(env, {
    auth: { authorization: token },
  });
};

export default getRequestClient;
