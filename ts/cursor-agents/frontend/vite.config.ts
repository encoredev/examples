import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Builds straight into the Encore web service, which serves it with api.static.
export default defineConfig({
  plugins: [react()],
  build: { outDir: "../web/dist", emptyOutDir: true },
});
