import { appMeta } from "encore.dev";
import { api } from "encore.dev/api";
import type http from "node:http";
import path from "node:path";
import { viteDevServer } from "./dev-server";

export type Handler = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  next: () => void,
) => void | Promise<void>;

// The React app lives in this directory. Encore runs the app from its root.
const root = path.resolve("frontend");

// Run Vite's dev server (with hot reloading) when running locally,
// and serve the production build (created by `npm run build`) in the cloud.
const handler: Promise<Handler> =
  appMeta().environment.cloud === "local"
    ? viteDevServer(root)
    : staticFiles(path.join(root, "dist"));

// Serves the frontend for every path that doesn't match an API endpoint.
export const frontend = api.raw(
  { expose: true, path: "/!path", method: "*" },
  async (req, resp) => {
    const handle = await handler;
    await handle(req, resp, () => {
      resp.statusCode = 404;
      resp.end("Not Found");
    });
  },
);

async function staticFiles(dir: string): Promise<Handler> {
  const { default: sirv } = await import("sirv");
  return sirv(dir, {
    single: true, // Serve index.html for client-side routes.
    etag: true,
    setHeaders: (res, pathname) => {
      // Vite fingerprints everything in /assets, so it can be cached forever.
      res.setHeader(
        "Cache-Control",
        pathname.startsWith("/assets/")
          ? "public, max-age=31536000, immutable"
          : "no-cache",
      );
    },
  });
}
