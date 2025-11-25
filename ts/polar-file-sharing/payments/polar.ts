import { Polar } from "@polar-sh/sdk";
import { secret } from "encore.dev/config";

// Define the secret - the actual value is set per environment
const polarAccessToken = secret("PolarAccessToken");

// Use sandbox for development, production for prod
const server = process.env.ENCORE_ENVIRONMENT === "production" 
  ? "production" 
  : "sandbox";

// Initialize the Polar SDK with your API key
export const polar = new Polar({
  accessToken: polarAccessToken(),
  server: server, // Sandbox for local dev, production when deployed
});

