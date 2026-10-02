import { appMeta } from "encore.dev";
import { api } from "encore.dev/api";
import fs from "node:fs/promises";
import path from "node:path";
import { viteDevServer } from "./dev-server";

// The React app lives in this directory. Encore runs the app from its root.
const root = path.resolve("frontend");

// Renders index.html: locally through Vite's dev server (with hot reloading),
// and in the cloud from the production build created by `npm run build`.
const renderIndex: Promise<() => Promise<string>> =
  appMeta().environment.cloud === "local"
    ? viteDevServer(root)
    : fs
        .readFile(path.join(root, "dist", "index.html"), "utf-8")
        .then((html) => async () => html);

// Serves the app's page.
export const index = api.raw(
  { expose: true, path: "/", method: "GET" },
  async (req, resp) => {
    const html = await (await renderIndex)();
    resp.setHeader("Content-Type", "text/html");
    resp.setHeader("Cache-Control", "no-cache");
    resp.end(html);
  },
);

// Serves the production build's scripts, styles and other files for every
// path that doesn't match an API endpoint, directly from Encore's Rust runtime.
// See https://encore.dev/docs/ts/primitives/static-assets
export const assets = api.static({
  expose: true,
  path: "/!path",
  // Created by `npm run build`, which `npm install` runs automatically.
  dir: "./dist",
});
