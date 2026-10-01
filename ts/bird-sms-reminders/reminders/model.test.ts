import { describe, expect, test } from "vitest";
import { birdIdempotencyKey, buildSmsRequest, canSendReminder, type ReminderRecord } from "./model";

const now = new Date("2026-09-28T12:00:00Z");
const reminder: ReminderRecord = {
  id: "reminder-1",
  appointment_id: "appointment-1",
  customer_name: "Ada",
  phone: "+15005550006",
  starts_at: new Date("2026-09-29T14:00:00Z"),
  appointment_status: "scheduled",
  due_at: new Date("2026-09-28T11:55:00Z"),
  reminder_status: "queued",
};

describe("reminder delivery", () => {
  test("sends a due reminder for a scheduled future appointment", () => {
    expect(canSendReminder(reminder, now)).toBe(true);
  });

  test.each([
    { change: { appointment_status: "cancelled" as const }, reason: "cancelled" },
    { change: { reminder_status: "accepted" as const }, reason: "already accepted by Bird" },
    { change: { due_at: new Date("2026-09-28T12:05:00Z") }, reason: "rescheduled" },
    { change: { starts_at: new Date("2026-09-28T11:00:00Z") }, reason: "in the past" },
  ])("does not send when the appointment is $reason", ({ change }) => {
    expect(canSendReminder({ ...reminder, ...change }, now)).toBe(false);
  });

  test("builds Bird's current SMS request shape and keeps retry identity stable", () => {
    expect(buildSmsRequest(reminder, "+15557654321")).toEqual({
      from: "+15557654321",
      to: "+15005550006",
      text: "Hi Ada, your appointment is scheduled for Sep 29, 2026, 2:00 PM UTC.",
      category: "transactional",
      metadata: {
        appointment_id: "appointment-1",
        reminder_id: "reminder-1",
      },
    });
    expect(birdIdempotencyKey(reminder.id)).toBe("appointment-reminder:reminder-1");
  });
});
