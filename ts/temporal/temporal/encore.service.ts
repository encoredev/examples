// temporal/encore.service.ts
import { Service } from "encore.dev/service";
import { initTemporal, shutdownTemporal } from "./client";

// Encore calls setup() once when the service starts and shutdown()
// when it stops. This is the right place for long-lived connections
// like the Temporal client and worker.
export default new Service("temporal", {
  setup: async () => {
    await initTemporal();
  },
  shutdown: async () => {
    await shutdownTemporal();
  },
});
