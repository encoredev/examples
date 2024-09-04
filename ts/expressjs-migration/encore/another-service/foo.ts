import { api } from "encore.dev/api";

// Dummy endpoint to illustrate service to service communication
export const foo = api(
  { expose: false, method: "GET", path: "/foo" },
  async (): Promise<{ data: string }> => {
    return { data: "bar" };
  },
);
