import { api } from "encore.dev/api";
import next from "next";

const app = next({
  dev: true,
  dir: "./frontend",
});
const handle = app.getRequestHandler();
const prepared = app.prepare();

export const nextjs = api.raw(
  { expose: true, path: "/!rest", method: "*" },
  async (req, resp) => {
    await prepared; // Wait for Next.js to start up.
    return handle(req, resp);
  },
);
