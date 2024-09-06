import { APICallMeta, currentRequest } from "encore.dev";
import { api } from "encore.dev/api";
import serveStatic from "serve-static";
import finalHandler from "finalhandler";

// The folder to serve static files from
const assets = serveStatic("public");

/**
 * Serve static files using a Raw endpoint with a fallback route.
 * The fallback route will be called if no other endpoint matches the request.
 */
export const serveStaticAssets = api.raw(
  { expose: true, path: "/!path", method: "*" },
  (req, resp) => {
    assets(req, resp, finalHandler(req, resp));
  },
);

/**
 * Serve static files using a Raw endpoint with a scoped fallback route.
 * Here we have scoped the path to /public/!path
 */
export const staticAssetsUnderPath = api.raw(
  { expose: true, path: "/public/!path", method: "*" },
  (req, resp) => {
    // Set the URL to the !path parameter
    req.url = (currentRequest() as APICallMeta).pathParams.path;

    assets(req, resp, finalHandler(req, resp));
  },
);
