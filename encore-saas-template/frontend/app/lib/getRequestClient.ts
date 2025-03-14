import Client, { Environment, Local } from "./client";
import { useRouter } from 'next/navigation';

/**
 * Returns the generated Encore request client for either the local or staging environment.
 * If we are running the frontend locally (development) we assume that our Encore
 * backend is also running locally.
 */
const getRequestClient = (token: string | undefined, options?: { baseURL?: string }) => {
  if (options?.baseURL) {
    return new Client(options.baseURL, {
      auth: token,
    });
  }

  const isLocal = process.env.NEXT_PUBLIC_ENVIRONMENT === "local";
  const env = isLocal ? Local : Environment(process.env.NEXT_PUBLIC_ENVIRONMENT || "staging");
  return new Client(env, {
    auth: token,
  });
};

export default getRequestClient;