import { Topic, Subscription } from "encore.dev/pubsub";
import { resend } from "./resend";

// Define the shape of an email event.
export interface EmailEvent {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

// Create a Pub/Sub topic for email events.
// Publishing to this topic returns instantly, keeping your API endpoints fast.
export const emailTopic = new Topic<EmailEvent>("emails", {
  deliveryGuarantee: "at-least-once",
});

// Subscribe to the topic to send emails in the background.
// Encore handles retries automatically if delivery fails.
// Note: The default "from" uses Resend's test address. To use your own,
// verify a domain at https://resend.com/domains and update the address below.
const _ = new Subscription(emailTopic, "send-email", {
  handler: async (event) => {
    const { data, error } = await resend.emails.send({
      from: event.from ?? "Encore <onboarding@resend.dev>",
      to: event.to,
      subject: event.subject,
      html: event.html,
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error(error.message);
    }

    console.log("Email sent:", data?.id);
  },
});
