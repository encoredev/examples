import path from "node:path";
/// <reference types="vitest" />
import { defineConfig } from "vite";

// Set by Encore Cloud when it runs your tests; unset locally.
// See https://encore.dev/docs/platform/test-statistics
const reportDir = process.env.ENCORE_TEST_REPORT_DIR;

// See https://encore.dev/docs/ts/develop/testing for more information on how to test with Encore.
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
