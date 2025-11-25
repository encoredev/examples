import { Polar } from "@polar-sh/sdk";

// Use sandbox for development, production for prod
const server = process.env.ENCORE_ENVIRONMENT === "production" 
  ? "production" 
  : "sandbox";

// For testing: hardcoded sandbox key
// TODO: Replace with secret("PolarAccessToken") for production
const accessToken = "polar_oat_HBROlPhA6Y73CKCHOh3g6xqQSQ5tj2Qgz1mpK2vo4CR";

export const polar = new Polar({
  accessToken: accessToken,
  server: server,
});

