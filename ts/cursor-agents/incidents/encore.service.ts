import { Service } from "encore.dev/service";

// The system the on-call agent works on: incidents, their timelines, and the
// deploys that might have caused them. Plain Encore APIs over Postgres, so the
// agent's tools are just typed calls into this service.
export default new Service("incidents");
