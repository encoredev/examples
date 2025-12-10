import { api } from "encore.dev/api";
import { resend } from "./resend";
import { db } from "./db";
import { render } from "@react-email/components";
import { WelcomeEmail } from "./templates/welcome";
import { PasswordResetEmail } from "./templates/password-reset";
import log from "encore.dev/log";

interface SendWelcomeEmailRequest {
  to: string;
  name: string;
  loginUrl?: string;
}

interface SendWelcomeEmailResponse {
  id: string;
  resendId: string;
}

export const sendWelcomeEmail = api(
  { expose: true, method: "POST", path: "/email/welcome" },
  async (req: SendWelcomeEmailRequest): Promise<SendWelcomeEmailResponse> => {
    const emailId = `email-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

    log.info("Sending welcome email", { to: req.to, emailId });

    // Render the React Email template to HTML
    const html = await render(
      WelcomeEmail({
        name: req.name,
        loginUrl: req.loginUrl || "https://yourapp.com/login",
      })
    );

    try {
      // Send email via Resend
      const { data, error } = await resend.emails.send({
        from: "onboarding@yourdomain.com",
        to: req.to,
        subject: "Welcome to our platform!",
        html,
      });

      if (error) {
        throw new Error(`Failed to send email: ${error.message}`);
      }

      // Store email record
      await db.exec`
        INSERT INTO emails (id, resend_id, recipient, subject, template, status, metadata)
        VALUES (
          ${emailId},
          ${data!.id},
          ${req.to},
          ${"Welcome to our platform!"},
          ${"welcome"},
          ${"sent"},
          ${JSON.stringify({ name: req.name })}
        )
      `;

      log.info("Welcome email sent", { emailId, resendId: data!.id });

      return {
        id: emailId,
        resendId: data!.id,
      };
    } catch (error) {
      // Store failed email
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      await db.exec`
        INSERT INTO emails (id, recipient, subject, template, status, error)
        VALUES (
          ${emailId},
          ${req.to},
          ${"Welcome to our platform!"},
          ${"welcome"},
          ${"failed"},
          ${errorMessage}
        )
      `;

      throw error;
    }
  }
);

interface SendPasswordResetRequest {
  to: string;
  name: string;
  resetUrl: string;
}

interface SendPasswordResetResponse {
  id: string;
  resendId: string;
}

export const sendPasswordReset = api(
  { expose: true, method: "POST", path: "/email/password-reset" },
  async (req: SendPasswordResetRequest): Promise<SendPasswordResetResponse> => {
    const emailId = `email-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

    const html = await render(
      PasswordResetEmail({
        name: req.name,
        resetUrl: req.resetUrl,
      })
    );

    const { data, error } = await resend.emails.send({
      from: "security@yourdomain.com",
      to: req.to,
      subject: "Reset your password",
      html,
    });

    if (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }

    await db.exec`
      INSERT INTO emails (id, resend_id, recipient, subject, template, status, metadata)
      VALUES (
        ${emailId},
        ${data!.id},
        ${req.to},
        ${"Reset your password"},
        ${"password-reset"},
        ${"sent"},
        ${JSON.stringify({ name: req.name })}
      )
    `;

    return {
      id: emailId,
      resendId: data!.id,
    };
  }
);

interface EmailRecord {
  id: string;
  recipient: string;
  subject: string;
  template: string | null;
  status: string;
  deliveredAt: Date | null;
  openedAt: Date | null;
  clickedAt: Date | null;
  createdAt: Date;
}

interface ListEmailsRequest {
  recipient?: string;
  limit?: number;
}

interface ListEmailsResponse {
  emails: EmailRecord[];
}

export const listEmails = api(
  { expose: true, method: "GET", path: "/email/list" },
  async (req: ListEmailsRequest): Promise<ListEmailsResponse> => {
    const limit = req.limit || 50;
    
    let query;
    if (req.recipient) {
      query = db.query<{
        id: string;
        recipient: string;
        subject: string;
        template: string | null;
        status: string;
        delivered_at: Date | null;
        opened_at: Date | null;
        clicked_at: Date | null;
        created_at: Date;
      }>`
        SELECT id, recipient, subject, template, status, delivered_at, opened_at, clicked_at, created_at
        FROM emails
        WHERE recipient = ${req.recipient}
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
    } else {
      query = db.query<{
        id: string;
        recipient: string;
        subject: string;
        template: string | null;
        status: string;
        delivered_at: Date | null;
        opened_at: Date | null;
        clicked_at: Date | null;
        created_at: Date;
      }>`
        SELECT id, recipient, subject, template, status, delivered_at, opened_at, clicked_at, created_at
        FROM emails
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
    }

    const emails: EmailRecord[] = [];
    for await (const row of query) {
      emails.push({
        id: row.id,
        recipient: row.recipient,
        subject: row.subject,
        template: row.template,
        status: row.status,
        deliveredAt: row.delivered_at,
        openedAt: row.opened_at,
        clickedAt: row.clicked_at,
        createdAt: row.created_at,
      });
    }

    return { emails };
  }
);

