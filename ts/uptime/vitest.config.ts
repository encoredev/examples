/// <reference types="vitest" />
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "~encore": path.resolve(import.meta.dirname, "./encore.gen"),
    },
  },
});
