import { api } from "encore.dev/api";

export const assets = api.static({
  expose: true,
  path: "/site/!path",
  dir: "./assets",
});
