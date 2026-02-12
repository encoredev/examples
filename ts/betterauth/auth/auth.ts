import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { secret } from "encore.dev/config";
import { db } from "./db";

// Store secrets using the Encore CLI:
//   encore secret set --type dev,local,pr,production AuthSecret
const authSecret = secret("AuthSecret");

// Create a pg Pool for Better Auth using Encore's connection string.
const pool = new Pool({
  connectionString: db.connectionString,
});

export const auth = betterAuth({
  secret: authSecret(),
  basePath: "/auth",
  database: pool,
  trustedOrigins: [
    "http://localhost:4000",
    "http://127.0.0.1:4000",
  ],
  emailAndPassword: {
    enabled: true,
  },
  // To enable GitHub OAuth:
  // 1. Create an OAuth app at https://github.com/settings/developers
  //    - Set callback URL to: http://localhost:4000/auth/callback/github
  // 2. Set the secrets:
  //    encore secret set --type dev,local,pr,production GithubClientId
  //    encore secret set --type dev,local,pr,production GithubClientSecret
  // 3. Uncomment the block below:
  //
  // socialProviders: {
  //   github: {
  //     clientId: secret("GithubClientId")(),
  //     clientSecret: secret("GithubClientSecret")(),
  //   },
  // },
});
