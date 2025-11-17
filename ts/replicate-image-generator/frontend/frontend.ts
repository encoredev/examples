import { api } from "encore.dev/api";

// Serve static files from the assets directory
export const frontend = api.static(
  { 
    expose: true, 
    path: "/!path", 
    dir: "./assets"
  },
);
