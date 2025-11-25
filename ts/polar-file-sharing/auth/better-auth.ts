import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { DB } from "./db";

// For local testing, hardcode the secret
// TODO: In production, use Encore's secret management: secret("BetterAuthSecret")
const authSecret = "7xqsjwnE6Bk9YGDYuxH32SeqrlVQt9DX";

// Create a PostgreSQL pool for BetterAuth
const pool = new Pool({
  connectionString: DB.connectionString,
});

// Create BetterAuth instance with database connection
export const auth = betterAuth({
  database: pool,
  secret: authSecret,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
  },
});

