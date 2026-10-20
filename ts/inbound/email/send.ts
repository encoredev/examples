import { api, APIError } from "encore.dev/api";
import { inbound } from "./inbound";
import log from "encore.dev/log";

interface SendEmailRequest {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

interface SendEmailResponse {
  id: string;
}

// Sends a transactional email using Inbound.
export const sendEmail = api(
  { expose: true, method: "POST", path: "/email/send" },
  async (req: SendEmailRequest): Promise<SendEmailResponse> => {
    try {
      const email = await inbound.emails.send({
        from: req.from ?? "notifications@yourdomain.com",
        to: req.to,
        subject: req.subject,
        html: req.html,
        reply_to: req.replyTo,
      });

      log.info("Email sent", { id: email.id, to: req.to });

      return { id: email.id };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      log.error("Failed to send email", { error: message });
      throw APIError.internal(`Failed to send email: ${message}`);
    }
  }
);

