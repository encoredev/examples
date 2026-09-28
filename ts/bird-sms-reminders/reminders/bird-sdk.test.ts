import { BirdClient } from "@messagebird/sdk";
import { describe, expect, test } from "vitest";
import { birdIdempotencyKey, buildSmsRequest, type ReminderRecord } from "./model";

describe("Bird SDK request", () => {
  test("sends the documented payload to the key's region with a stable idempotency key", async () => {
    let captured: Request | undefined;
    const bird = new BirdClient({
      apiKey: "bk_eu1_test",
      fetch: async (input, init) => {
        captured = input instanceof Request ? input : new Request(input, init);
        return new Response(JSON.stringify({ id: "sms_01test", status: "accepted" }), {
          status: 202,
          headers: { "Content-Type": "application/json", "X-Request-Id": "req_01test" },
        });
      },
    });
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

    const result = await bird.sms.send(
      buildSmsRequest(reminder, "+15557654321"),
      { idempotencyKey: birdIdempotencyKey(reminder.id) },
    );

    expect(result.id).toBe("sms_01test");
    expect(captured?.url).toBe("https://eu1.platform.bird.com/v1/sms/messages");
    expect(captured?.method).toBe("POST");
    expect(captured?.headers.get("authorization")).toBe("Bearer bk_eu1_test");
    expect(captured?.headers.get("idempotency-key")).toBe("appointment-reminder:reminder-1");
    expect(await captured?.json()).toMatchObject({
      from: "+15557654321",
      to: "+15005550006",
      category: "transactional",
      metadata: { appointment_id: "appointment-1", reminder_id: "reminder-1" },
    });
  });
});
