import type { SmsSendParams } from "@messagebird/sdk";

export interface ReminderRecord {
  id: string;
  appointment_id: string;
  customer_name: string;
  phone: string;
  starts_at: Date;
  appointment_status: "scheduled" | "cancelled";
  due_at: Date;
  reminder_status: "pending" | "queued" | "accepted" | "skipped";
}

export function canSendReminder(reminder: ReminderRecord, now = new Date()): boolean {
  return (
    reminder.appointment_status === "scheduled" &&
    reminder.reminder_status === "queued" &&
    reminder.due_at.getTime() <= now.getTime() &&
    reminder.starts_at.getTime() > now.getTime()
  );
}

export function buildSmsRequest(
  reminder: Pick<ReminderRecord, "id" | "appointment_id" | "customer_name" | "phone" | "starts_at">,
  from: string,
): SmsSendParams {
  const appointmentTime = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(reminder.starts_at);

  return {
    from,
    to: reminder.phone,
    text: `Hi ${reminder.customer_name}, your appointment is scheduled for ${appointmentTime} UTC.`,
    category: "transactional",
    metadata: {
      appointment_id: reminder.appointment_id,
      reminder_id: reminder.id,
    },
  };
}

export function birdIdempotencyKey(reminderID: string): string {
  return `appointment-reminder:${reminderID}`;
}
