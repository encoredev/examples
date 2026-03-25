import { Configuration, FrontendApi } from "@ory/client";
import { secret } from "encore.dev/config";

// Store the secret using the Encore CLI:
//   encore secret set --type dev,local,pr,production OryProjectSlug
export const oryProjectSlug = secret("OryProjectSlug");

export const ory = new FrontendApi(
  new Configuration({
    basePath: `https://${oryProjectSlug()}.projects.oryapis.com`,
  })
);
