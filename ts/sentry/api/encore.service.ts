import { Service } from "encore.dev/service";
import { secret } from "encore.dev/config";
import { initSentry } from "../lib/sentry";

// Secret must be loaded from within a service.
const sentryDsn = secret("SentryDSN");

// Initialize Sentry when the service starts.
initSentry(sentryDsn());

export default new Service("api");
