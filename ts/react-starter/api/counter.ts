import { api } from "encore.dev/api";

// Welcome to Encore!
//
// To run it this starter, execute "encore run" in your favorite shell.

// Learn how to replace this counter with a PostgreSQL database with only a few lines of code:
// https://encore.dev/docs/ts/primitives/databases
let counter = 0;

interface CounterResponse {
  value: number;
}

export const get = api(
  { expose: true, method: "GET", path: "/counter" },
  async (): Promise<CounterResponse> => {
    return { value: counter };
  },
);

export const increment = api(
  { expose: true, method: "POST", path: "/counter" },
  async (): Promise<CounterResponse> => {
    counter++;
    return { value: counter };
  },
);

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
// 2. To continue exploring Encore with TypeScript, check out one of these topics:
//
//    Building a REST API:   https://encore.dev/docs/ts/tutorials/rest-api
//    Creating Services:      https://encore.dev/docs/ts/primitives/services
//    Creating APIs:         https://encore.dev/docs/ts/primitives/defining-apis
//    Using SQL Databases:        https://encore.dev/docs/ts/primitives/databases
//    Using Pub/Sub:         https://encore.dev/docs/ts/primitives/pubsub
//    Authenticating users:  https://encore.dev/docs/ts/develop/auth
//    Using Cron Jobs: https://encore.dev/docs/ts/primitives/cron-jobs
//    Using Secrets: https://encore.dev/docs/ts/primitives/secrets