import { Database } from "@encore.dev/sdk/storage/postgres";

// db holds the monitored sites and the result of every check. Encore
// provisions it and applies ./migrations before the service starts.
export const db = new Database("{{ident}}", { migrations: "./migrations" });

/** A monitored website. */
export interface Site {
  id: number;
  /** The site's address. Without a scheme, it is checked over https. */
  url: string;
}
