import { Service } from "encore.dev/service";

// Hosts the on-call agent. The Cursor SDK runs the agent loop inside this
// service's process; Encore provides the database, secrets, Pub/Sub and cron
// around it, and provisions all of it in your own AWS or GCP account.
export default new Service("agent");
