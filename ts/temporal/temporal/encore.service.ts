import { Service } from "encore.dev/service";
import { initTemporal } from "./client";

// Initialize Temporal client and worker when the service loads.
initTemporal();

export default new Service("temporal");
