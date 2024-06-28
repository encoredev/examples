import { Topic } from "encore.dev/pubsub";
import { ProviderMessage } from "../provider/provider";

// This topic is used to forward messages from the provider to the chat service
// We need to keep it in a separate file to avoid circular dependencies between the chat and provider services
export const providerMessageTopic = new Topic<ProviderMessage>(
  "provider-message",
  {
    deliveryGuarantee: "at-least-once",
  },
);
