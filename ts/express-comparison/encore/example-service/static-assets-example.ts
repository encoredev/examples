import { api } from "encore.dev/api";
import path from "node:path";
import fs from "node:fs";
import { APICallMeta, currentRequest } from "encore.dev";

// Making use of raw endpoints to serve static assets from the file system.
// https://encore.dev/docs/ts/primitives/services-and-apis#raw-endpoints
export const serveAssets = api.raw(
  { expose: true, path: "/assets/!rest", method: "GET" },
  async (_, resp) => {
    const meta = currentRequest() as APICallMeta;

    // extract URL path
    const fsPath = meta.pathParams.rest;
    // based on the URL path, extract the file extension. e.g. .js, .doc, ...
    const ext = path.parse(fsPath).ext;
    // maps file extension to MIME typere
    const map: Record<string, string> = {
      ".html": "text/html",
      ".js": "text/javascript",
      ".css": "text/css",
      // Add the MIME types you need or use a library like mime
    };

    fs.stat(fsPath, (err) => {
      if (err) {
        // if the file is not found, return 404
        resp.statusCode = 404;
        resp.end(`File ${fsPath} not found!`);
        return;
      }

      // read file from file system
      fs.readFile(fsPath, (err, data) => {
        if (err) {
          resp.statusCode = 500;
          resp.end(`Error getting the file: ${err}.`);
        } else {
          // if the file is found, set Content-type and send data
          resp.setHeader("Content-type", map[ext]);
          resp.end(data);
        }
      });
    });
  },
);
