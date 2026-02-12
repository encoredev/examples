import { Polar } from "@polar-sh/sdk";
import { secret } from "encore.dev/config";

// Store your Polar access token as an Encore secret:
//   encore secret set --type dev,local,pr,production PolarAccessToken
const polarAccessToken = secret("PolarAccessToken");

// Use "sandbox" for development, "production" when deployed.
const server =
  process.env.ENCORE_ENVIRONMENT === "production" ? "production" : "sandbox";

export const polar = new Polar({
  accessToken: polarAccessToken(),
  server,
});
