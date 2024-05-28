import { api } from "encore.dev/api";
import * as url from "node:url";
import path from "node:path";
import * as fs from "node:fs";

export const serveFrontend = api.raw(
  { expose: true, path: "/!rest", method: "*" },
  async (req, resp) => {
    const baseURL = "https://" + req.headers.host + "/";
    const parsedUrl = new URL(req.url!, baseURL);
    const pathname =
      parsedUrl.pathname === "/" ? "/index.html" : parsedUrl.pathname;

    // extract URL path
    const fsPath = `./frontend/dist${pathname}`;
    // based on the URL path, extract the file extension. e.g. .js, .doc, ...
    const ext = path.parse(fsPath).ext;
    // maps file extension to MIME typere
    const map: Record<string, string> = {
      ".html": "text/html",
      ".js": "text/javascript",
      ".png": "image/png",
      ".svg": "image/svg+xml",
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
          resp.setHeader("Content-type", map[ext] || "text/plain");
          resp.end(data);
        }
      });
    });
  },
);
