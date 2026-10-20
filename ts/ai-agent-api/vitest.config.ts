/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "~encore": path.resolve(import.meta.dirname, "./encore.gen"),
    },
  },
});
