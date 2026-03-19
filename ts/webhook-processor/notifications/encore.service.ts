import { Service } from "encore.dev/service";

// The notifications service logs important webhook events. Demonstrates the Pub/Sub fan-out pattern.
export default new Service("notifications");
