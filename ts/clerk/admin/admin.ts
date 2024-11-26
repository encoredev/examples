import { api } from "encore.dev/api";
import log from "encore.dev/log";
import { getAuthData } from "~encore/auth";

// Welcome to Encore.ts!
//
// To run it this starter, execute "encore run" in your favorite shell.

// ==================================================================

// Endpoint that responds with a hardcoded value.
// To call it, run in your terminal:
//
//	curl --header "Authorization: dummy-token" http://localhost:4000/admin
//
export const getDashboardData = api(
  {
    expose: true, // Is publicly accessible
    auth: true, // Auth handler validation is required
    method: "GET",
    path: "/admin",
  },
  async (): Promise<DashboardData> => {
    const userID = getAuthData()!.userID;
    // Log statements are viewable in the traces:
    log.info("Data requested by user", { userID });

    return { value: "Admin stuff" };
  },
);

interface DashboardData {
  value: string;
}

// ==================================================================

// Encore comes with a built-in development dashboard for
// exploring your API, viewing documentation, debugging with
// distributed tracing, and more. Visit your API URL in the browser:
//
//     http://localhost:9400
//

// ==================================================================

// Next steps
//
// 1. Deploy your application to the cloud
//
//     git add -A .
//     git commit -m 'Commit message'
//     git push encore
//
// 2. To continue exploring Encore.ts, check out one of these topics:
//
//    Building a REST API:   https://encore.dev/docs/ts/tutorials/rest-api
//    Creating Services:      https://encore.dev/docs/ts/primitives/services
//    Creating APIs:         https://encore.dev/docs/ts/primitives/defining-apis
//    Using SQL Databases:        https://encore.dev/docs/ts/primitives/databases
//    Using Pub/Sub:         https://encore.dev/docs/ts/primitives/pubsub
//    Authenticating users:  https://encore.dev/docs/ts/develop/auth
//    Using Cron Jobs: https://encore.dev/docs/ts/primitives/cron-jobs
//    Using Secrets: https://encore.dev/docs/ts/primitives/secrets