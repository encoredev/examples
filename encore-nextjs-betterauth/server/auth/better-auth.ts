// auth/better-auth.ts
import { betterAuth } from "better-auth"
import { Pool } from "pg"
import { DB } from "./db"
import { secret } from "encore.dev/config"

// Secrets let you store sensitive values like API keys securely
// Learn more: https://encore.dev/docs/ts/primitives/secrets
const authSecret = secret("BetterAuthSecret")

// Create a PostgreSQL pool for BetterAuth
const pool = new Pool({
  connectionString: DB.connectionString,
})

// Create BetterAuth instance with database connection
export const auth = betterAuth({
  database: pool,
  secret: authSecret(),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
  },
})
