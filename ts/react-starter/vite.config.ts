import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { watch } from "vite-plugin-watch";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    watch({
      // Watch the API directory and run the "gen" script when changes are detected
      pattern: "./api/**/*",
      command: "npm run gen",
    }),
  ],
});
