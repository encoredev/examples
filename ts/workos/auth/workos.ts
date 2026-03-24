import { WorkOS } from "@workos-inc/node";
import { secret } from "encore.dev/config";

// Store secrets using the Encore CLI:
//   encore secret set --type dev,local,pr,production WorkOSApiKey
//   encore secret set --type dev,local,pr,production WorkOSClientID
//   encore secret set --type dev,local WorkOSRedirectURI
//     (e.g. http://localhost:4000/auth/callback — use the port from `encore run` output)
export const workosApiKey = secret("WorkOSApiKey");
export const workosClientId = secret("WorkOSClientID");
export const workosRedirectUri = secret("WorkOSRedirectURI");

export const workos = new WorkOS(workosApiKey(), {
  clientId: workosClientId(),
});
