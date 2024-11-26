import { api } from "encore.dev/api";
import log from "encore.dev/log";

// Logging example
// https://encore.dev/docs/ts/observability/logging
export const loggingExample = api(
  { expose: true, method: "GET", path: "/logging" },
  async (): Promise<{ message: string }> => {
    try {
      // TODO: Fetch something from the DB
    } catch (err) {
      log.error(err, "something went terribly wrong!");
    }

    log.info("log message", { is_subscriber: true });

    return { message: "Hello!" };
  },
);
