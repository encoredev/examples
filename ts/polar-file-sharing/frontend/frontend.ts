import { api } from "encore.dev/api";

export const serve = api.static({
  expose: true,
  path: "/*path",
  dir: "./assets",
});

