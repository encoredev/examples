import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db.js";
import * as schema from "./schema.js";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:4001",
  // ⚠️ SECURITY: Change this secret in production!
  // Use: encore secret set --type prod BETTER_AUTH_SECRET
  secret: process.env.BETTER_AUTH_SECRET || "your-secret-key-min-32-chars-long-for-jwt-signing",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  socialProviders: {
    // Add OAuth providers as needed
    // github: {
    //   clientId: process.env.GITHUB_CLIENT_ID!,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    // },
  },
  // Allow any localhost port during development
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001", 
    "http://localhost:3002",
    "http://localhost:4000",
    "http://localhost:4001",
  ],
});

export type Auth = typeof auth;

