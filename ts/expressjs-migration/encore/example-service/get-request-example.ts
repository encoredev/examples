import { api, Query } from "encore.dev/api";

// Dynamic path parameter :name
// https://encore.dev/docs/ts/primitives/defining-apis#path-parameters
export const dynamicPathParamExample = api(
  { expose: true, method: "GET", path: "/hello/:name" },
  async ({ name }: { name: string }): Promise<{ message: string }> => {
    const msg = `Hello ${name}!`;
    return { message: msg };
  },
);

interface RequestParams {
  // Encore will now automatically parse the query string parameter
  // https://encore.dev/docs/ts/primitives/defining-apis#query-parameters
  name?: Query<string>;
}

// Query string parameter ?name
export const queryStringExample = api(
  { expose: true, method: "GET", path: "/hello" },
  async ({ name }: RequestParams): Promise<{ message: string }> => {
    const msg = `Hello ${name}!`;
    return { message: msg };
  },
);
