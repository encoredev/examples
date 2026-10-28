import { api } from "encore.dev/api";

// Serves the chat UI (built from ../frontend into ./dist) from the same app, so one deploy
// ships the agent, its database and its interface together.
export const assets = api.static({
  expose: true,
  path: "/!path",
  dir: "./dist",
  notFound: "./dist/index.html",
});
