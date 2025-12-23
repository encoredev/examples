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
    const { data, error } = await inbound.emails.send({
      from: req.from ?? "notifications@yourdomain.com",
      to: req.to,
      subject: req.subject,
      html: req.html,
      replyTo: req.replyTo,
    });

    if (error) {
      log.error("Failed to send email", { error: error.message });
      throw APIError.internal(`Failed to send email: ${error.message}`);
    }

    log.info("Email sent", { id: data?.id, to: req.to });

    return { id: data!.id };
  }
);

