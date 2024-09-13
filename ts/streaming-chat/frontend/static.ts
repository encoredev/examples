import { api } from "encore.dev/api";

// Making use of app.static to serve static assets from the dist directory.
// https://encore.dev/docs/ts/primitives/static-assets

export const assets = api.static({
  expose: true,
  path: "/!path",
  dir: "./dist",
});
