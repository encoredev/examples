/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import path from "path";

// Set by Encore Cloud when it runs your tests; unset locally.
// See https://encore.dev/docs/platform/test-statistics
const reportDir = process.env.ENCORE_TEST_REPORT_DIR;

export default defineConfig({
  resolve: {
    alias: {
      "~encore": path.resolve(__dirname, "./encore.gen"),
    },
  },
  test: {
    // Publish a JUnit report to Encore Cloud, and keep the usual output in the build log.
    reporters: reportDir ? ["default", "junit"] : ["default"],
    outputFile: reportDir
      ? { junit: path.join(reportDir, "junit.xml") }
      : undefined,
  },
});
