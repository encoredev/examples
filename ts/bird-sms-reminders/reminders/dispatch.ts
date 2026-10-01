import { api } from "encore.dev/api";
import { CronJob } from "encore.dev/cron";
import { Subscription, Topic } from "encore.dev/pubsub";
import { db } from "./db";
import { missingBirdSecrets, sendReminder } from "./bird";
import { canSendReminder, type ReminderRecord } from "./model";

export interface ReminderDue {
  reminderID: string;
}

export const remindersDue = new Topic<ReminderDue>("reminders-due", {
  deliveryGuarantee: "at-least-once",
});

export const dispatch = api(
  { expose: true, method: "POST", path: "/reminders/dispatch" },
  async (): Promise<{ queued: number }> => {
    const due = await db.queryAll<{ id: string }>`
      SELECT id
      FROM reminders
      WHERE status = 'pending' AND due_at <= NOW()
      ORDER BY due_at
      LIMIT 100
    `;

    let queued = 0;
    for (const reminder of due) {
      const claimed = await db.queryRow<{ id: string }>`
        UPDATE reminders
        SET status = 'queued', updated_at = NOW()
        WHERE id = ${reminder.id} AND status = 'pending'
        RETURNING id
      `;
      if (!claimed) continue;

      try {
        await remindersDue.publish({ reminderID: reminder.id });
        queued++;
      } catch (error) {
        await db.exec`
          UPDATE reminders
          SET status = 'pending', updated_at = NOW()
          WHERE id = ${reminder.id} AND status = 'queued'
        `;
        throw error;
      }
    }
    return { queued };
  },
);

new CronJob("dispatch-reminders", {
  title: "Dispatch appointment reminders",
  every: "5m",
  endpoint: dispatch,
});

export const birdStatus = api(
  { expose: true, method: "GET", path: "/reminders/bird-status" },
  async (): Promise<{ configured: boolean; missingSecrets: string[] }> => {
    const missingSecrets = missingBirdSecrets();
    return { configured: missingSecrets.length === 0, missingSecrets };
  },
);

async function loadReminder(reminderID: string): Promise<ReminderRecord | null> {
  return db.queryRow<ReminderRecord>`
    SELECT r.id, r.appointment_id, r.due_at,
           r.status AS reminder_status, a.customer_name, a.phone,
           a.starts_at, a.status AS appointment_status
    FROM reminders r
    JOIN appointments a ON a.id = r.appointment_id
    WHERE r.id = ${reminderID}
  `;
}

export async function handleReminderDue(event: ReminderDue): Promise<void> {
  const reminder = await loadReminder(event.reminderID);
  if (!reminder || reminder.reminder_status === "accepted" || reminder.reminder_status === "skipped") {
    return;
  }

  if (!canSendReminder(reminder)) {
    if (reminder.appointment_status === "cancelled" || reminder.starts_at <= new Date()) {
      await db.exec`
        UPDATE reminders SET status = 'skipped', updated_at = NOW()
        WHERE id = ${reminder.id} AND status <> 'accepted'
      `;
    }
    return;
  }

  // Without Bird credentials, put the reminder back so the next dispatch
  // picks it up once the secrets are set, rather than retrying a send that
  // can't succeed.
  if (missingBirdSecrets().length > 0) {
    await db.exec`
      UPDATE reminders SET status = 'pending', last_error = NULL, updated_at = NOW()
      WHERE id = ${reminder.id} AND status = 'queued'
    `;
    return;
  }

  await db.exec`
    UPDATE reminders
    SET attempt_count = attempt_count + 1, last_error = NULL, updated_at = NOW()
    WHERE id = ${reminder.id}
  `;

  try {
    const birdMessageID = await sendReminder(reminder);
    await db.exec`
      UPDATE reminders
      SET status = 'accepted', bird_message_id = ${birdMessageID},
          accepted_at = NOW(), updated_at = NOW()
      WHERE id = ${reminder.id}
    `;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Bird request failed";
    await db.exec`
      UPDATE reminders SET last_error = ${message}, updated_at = NOW()
      WHERE id = ${reminder.id}
    `;
    throw error;
  }
}

new Subscription(remindersDue, "send-reminder-with-bird", {
  handler: handleReminderDue,
});
