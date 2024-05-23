import { api, APIError } from "encore.dev/api";

export interface HelloResponse {
  message: string;
}

export const get = api(
  { expose: true, auth: false, method: "GET", path: "/hello/:name" },
  async ({ name }: { name: string }): Promise<HelloResponse> => {
    if (!name) throw APIError.invalidArgument;
    const msg = `Hello ${name}!`;
    return { message: msg };
  },
);
