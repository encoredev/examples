import path from "node:path";
/// <reference types="vitest" />
import { defineConfig } from "vite";

// See https://encore.dev/docs/ts/develop/testing for more information on how to test with Encore.
export default defineConfig({
	resolve: {
		alias: {
			"~encore": path.resolve(__dirname, "./encore.gen"),
		},
	},
});
