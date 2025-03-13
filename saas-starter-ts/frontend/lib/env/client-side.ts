import { z } from "zod";

const clientSideEnvSchema = z.object({
	NEXT_PUBLIC_VERCEL_ENV: z.enum(["development", "preview", "production"]),
	NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID: z
		.string()
		.transform((v) => (v === "" ? undefined : v)), // Treat an empty string as undefined
});

/**
 * Type-safe environment variables available client-side
 */
export const clientSideEnv = clientSideEnvSchema.parse({
	NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
	NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID:
		process.env.NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID,
});
