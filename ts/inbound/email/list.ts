import { api } from "encore.dev/api";
import { db } from "./db";

interface Email {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  receivedAt: Date;
  threadId: string | null;
}

interface ListEmailsResponse {
  emails: Email[];
}

// Lists the most recent emails.
export const listEmails = api(
  { expose: true, method: "GET", path: "/emails" },
  async (): Promise<ListEmailsResponse> => {
    const rows = await db.query<{
      id: string;
      sender: string;
      recipient: string;
      subject: string;
      received_at: Date;
      thread_id: string | null;
    }>`
      SELECT id, sender, recipient, subject, received_at, thread_id
      FROM emails
      ORDER BY received_at DESC
      LIMIT 50
    `;

    const emails: Email[] = [];
    for await (const row of rows) {
      emails.push({
        id: row.id,
        sender: row.sender,
        recipient: row.recipient,
        subject: row.subject,
        receivedAt: row.received_at,
        threadId: row.thread_id,
      });
    }

    return { emails };
  }
);

