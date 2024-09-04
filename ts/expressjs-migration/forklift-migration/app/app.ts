import { api } from "encore.dev/api";
import app from "./express-app";

// Endpoint defined with Encore.ts
export const get = api(
  { expose: true, method: "GET", path: "/encore" },
  async (): Promise<{ message: string }> => {
    return { message: "Hello from Encore!" };
  },
);

// You can use a forklift migration strategy and move the entire application
// over to Encore.ts in one shot by wrapping your existing HTTP router in a catch-all handler.
export const expressApp = api.raw(
  { expose: true, method: "*", path: "/!rest" },
  app,
);
