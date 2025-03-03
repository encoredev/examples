import path from "node:path";
/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
	resolve: {
		alias: {
			"~encore": path.resolve(__dirname, "./encore.gen"),
		},
	},
});
