import { z } from "zod";

const serverSideEnvSchema = z.object({
	VERCEL_ENV: z.enum(["development", "preview", "production"]),
	VERCEL_GIT_PULL_REQUEST_ID: z
		.string()
		.transform((v) => (v === "" ? undefined : v)), // Treat an empty string as undefined
});

/**
 * Type-safe environment variables available server-side
 */
export const serverSideEnv = serverSideEnvSchema.parse({
	VERCEL_ENV: process.env.VERCEL_ENV,
	VERCEL_GIT_PULL_REQUEST_ID: process.env.VERCEL_GIT_PULL_REQUEST_ID,
});
