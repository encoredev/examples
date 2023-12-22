import Cookies from "js-cookie";
import Client, { Environment, Local } from "./client";

/**
 * Returns the Encore request client for either the local or staging environment.
 * If we are running the frontend locally (development) we assume that our Encore backend is also running locally
 * and make requests to that, otherwise we use the staging client.
 */
const getRequestClient = () => {
  const token = Cookies.get("auth-token");
  const env = window.location.host.includes("localhost")
    ? Local
    : Environment("staging");

  return new Client(env, {
    auth: { Authorization: `Bearer ${token}` },
  });
};

export default getRequestClient;
