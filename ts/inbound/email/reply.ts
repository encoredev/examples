import { api, APIError } from "encore.dev/api";
import { inbound } from "./inbound";
import { db } from "./db";
import log from "encore.dev/log";

interface ReplyRequest {
  emailId: string;
  html: string;
}

interface ReplyResponse {
  id: string;
}

// Sends a reply to an existing email, maintaining the conversation thread.
export const replyToEmail = api(
  { expose: true, method: "POST", path: "/email/reply" },
  async (req: ReplyRequest): Promise<ReplyResponse> => {
    // Get the original email
    const original = await db.queryRow<{
      sender: string;
      subject: string;
      thread_id: string | null;
    }>`
      SELECT sender, subject, thread_id FROM emails WHERE id = ${req.emailId}
    `;

    if (!original) {
      throw APIError.notFound("Email not found");
    }

    const { data, error } = await inbound.emails.send({
      from: "support@yourdomain.com",
      to: original.sender,
      subject: original.subject.startsWith("Re:")
        ? original.subject
        : `Re: ${original.subject}`,
      html: req.html,
      headers: {
        "In-Reply-To": req.emailId,
        References: req.emailId,
      },
    });

    if (error) {
      throw APIError.internal(`Failed to send reply: ${error.message}`);
    }

    log.info("Reply sent", { id: data?.id, to: original.sender });

    return { id: data!.id };
  }
);

