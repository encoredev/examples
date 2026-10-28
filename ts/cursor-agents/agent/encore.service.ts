import { Service } from "encore.dev/service";

// Hosts the agent. The Cursor SDK runs the agent loop inside this service's
// process; Encore provides the database around it and provisions it, with the
// rest of the app, in your own AWS or GCP account.
export default new Service("agent");
