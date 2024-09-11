import { api } from "encore.dev/api";

// Making use of app.static to serve static assets from the file system.
// https://encore.dev/docs/ts/primitives/static-assets

// Serve all files in the ./assets directory under the /public path prefix.
export const assets = api.static({
  expose: true,
  path: "/public/*path",
  dir: "./assets",
});

// Using fallback route to serve all files in the ./assets directory under the root path.
export const rootAssets = api.static({
  expose: true,
  path: "/!path",
  dir: "./assets",
  // When a file matching the request isn't found, Encore automatically serves a 404 Not Found response.
  // You can customize the response by setting the notFound option to specify a file that should be served instead:
  notFound: "./assets/not_found.html",
});
