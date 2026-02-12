import { api } from "encore.dev/api";
import { emailTopic } from "./topic";

interface SendRequest {
  to: string;
  subject: string;
  html: string;
}

interface SendResponse {
  message: string;
}

// Send an email asynchronously via Pub/Sub.
// The email is queued and delivered in the background.
export const send = api(
  { expose: true, method: "POST", path: "/email/send" },
  async (req: SendRequest): Promise<SendResponse> => {
    await emailTopic.publish({
      to: req.to,
      subject: req.subject,
      html: req.html,
    });

    return { message: `Email queued for ${req.to}` };
  }
);
