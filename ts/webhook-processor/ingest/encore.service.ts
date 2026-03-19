import { Service } from "encore.dev/service";

// The ingest service receives webhooks, validates signatures, and publishes events to a Pub/Sub topic.
export default new Service("ingest");
