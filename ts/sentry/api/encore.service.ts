import { Service } from "encore.dev/service";
import { initSentry } from "../lib/sentry";

// Initialize Sentry when the service starts.
initSentry();

export default new Service("api");
