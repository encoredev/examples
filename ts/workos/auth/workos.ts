import { WorkOS } from "@workos-inc/node";
import { secret } from "encore.dev/config";

// Store secrets using the Encore CLI:
//   encore secret set --type dev,local,pr,production WorkOSApiKey
//   encore secret set --type dev,local,pr,production WorkOSClientID
export const workosApiKey = secret("WorkOSApiKey");
export const workosClientId = secret("WorkOSClientID");

export const workos = new WorkOS(workosApiKey(), {
  clientId: workosClientId(),
});
