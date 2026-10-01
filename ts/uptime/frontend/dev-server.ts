import log from "encore.dev/log";
import fs from "node:fs/promises";
import http from "node:http";
import type { AddressInfo } from "node:net";
import path from "node:path";
import type { Handler } from "./frontend";

// Vite serves the app's modules and hot reloading from its own port, so that
// only page loads go through Encore and your traces aren't flooded with
// requests for source files. See https://vite.dev/guide/backend-integration
const HOST = "127.0.0.1";
const PORT = 4400;

export async function viteDevServer(root: string): Promise<Handler> {
  const { createServer } = await import("vite");

  const server = http.createServer();
  const port = await listen(server, PORT);
  const origin = `http://${HOST}:${port}`;

  const vite = await createServer({
    root,
    appType: "custom",
    server: { middlewareMode: true, origin, hmr: { server } },
  });
  server.on("request", vite.middlewares);

  return async (req, res, next) => {
    if (!req.headers.accept?.includes("text/html")) {
      return vite.middlewares(req, res, next);
    }

    const template = await fs.readFile(path.join(root, "index.html"), "utf-8");
    const html = await vite.transformIndexHtml(req.url ?? "/", template);
    res.setHeader("Content-Type", "text/html");
    // Load scripts and styles from the Vite server.
    res.end(html.replace(/(src="|href="|from ")\/(?!\/)/g, `$1${origin}/`));
  };
}

// Encore starts the new process before stopping the old one when it reloads
// the app, so wait for the previous process to release the port. Keeping the
// same port lets open browser tabs reconnect and reload automatically.
async function listen(server: http.Server, port: number): Promise<number> {
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      await new Promise<void>((resolve, reject) => {
        server.once("error", reject);
        server.listen(port, HOST, () => {
          server.off("error", reject);
          resolve();
        });
      });
      return (server.address() as AddressInfo).port;
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== "EADDRINUSE") throw err;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  log.warn(`port ${port} is in use, starting the Vite dev server on a random port`);
  return listen(server, 0);
}
