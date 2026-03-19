import { Service } from "encore.dev/service";

// The billing service manages subscriptions. Auto-provisions free plans for new users via Pub/Sub.
export default new Service("billing");
