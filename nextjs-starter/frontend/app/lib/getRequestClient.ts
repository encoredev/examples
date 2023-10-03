import { cookies } from "next/headers";
import Client, { ClientOptions, Environment, Local } from "@/app/lib/client";

/**
 * Returns the Encore request client for either the local or staging environment.
 * If we are running the frontend locally (development) we assume that our Encore backend is also running locally
 * and make requests to that, otherwise we use the staging client.
 */
const getRequestClient = () => {
  const cookieStore = cookies();
  const token = cookieStore.get("auth-token")?.value;
  const options: ClientOptions = {
    auth: token,
  };

  return process.env.NODE_ENV === "development"
    ? new Client(Local, options)
    : new Client(Environment("staging"), options);
};

export default getRequestClient;
