import { api } from "encore.dev/api";
import { auth } from "./auth";

// Expose all Better Auth routes (sign-in, sign-up, OAuth callbacks, etc.)
// We convert the Node.js request to a Web Request since Better Auth expects it.
export const authRoutes = api.raw(
  { expose: true, path: "/auth/*path", method: "*" },
  async (req, res) => {
    // Read the request body from the stream
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const body = Buffer.concat(chunks);

    // Build a Web Request from the Node.js request
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value) headers.append(key, Array.isArray(value) ? value.join(", ") : value);
    }

    const url = `http://${req.headers.host}${req.url}`;
    const webReq = new Request(url, {
      method: req.method,
      headers,
      body: ["GET", "HEAD"].includes(req.method || "") ? undefined : body,
    });

    // Pass to Better Auth and forward the response
    const response = await auth.handler(webReq);

    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    res.writeHead(response.status);
    res.end(await response.text());
  }
);
