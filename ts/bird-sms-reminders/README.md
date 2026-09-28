# Bird + Encore SMS Reminder Example

Build and run an appointment reminder backend with [Encore](https://encore.dev) and send SMS through [Bird](https://bird.com). The example stores appointment and delivery state in PostgreSQL, finds due reminders with a cron-triggered API, moves sends through Pub/Sub, and verifies Bird delivery webhooks against their raw request bodies.

[![Deploy to Encore](https://github.com/encoredev/examples/raw/main/assets/deploytoenc.svg)](https://app.encore.cloud/create-app/clone/ts-bird-sms-reminders)

## What's included

- PostgreSQL tables for appointments, reminders, and deduplicated delivery events
- A five-minute cron job that publishes due reminders to Pub/Sub
- A subscriber that rechecks cancelled, rescheduled, and expired appointments before sending
- Bird's official TypeScript SDK with a stable idempotency key for each reminder
- A raw webhook endpoint using Bird's Standard Webhooks signature verification
- Tests for cancellation and rescheduling decisions, the Bird SMS request, idempotency, and signed webhooks

## Run locally

Install the [Encore CLI](https://encore.dev/docs/ts/install), then create the app from this example:

```bash
encore app create bird-reminders --example=ts/bird-sms-reminders
cd bird-reminders
npm install
encore run
```

Encore starts the API, PostgreSQL, and Pub/Sub locally. Cron jobs do not fire automatically in the local environment, so call the dispatch endpoint directly while testing.

Create an appointment whose reminder is already due:

```bash
curl -X POST http://localhost:4000/appointments \
  -H 'Content-Type: application/json' \
  -d '{
    "customerName": "Ada",
    "phone": "+15005550006",
    "startsAt": "2026-10-02T14:00:00Z",
    "remindAt": "2026-10-01T14:00:00Z"
  }'
```

Use the returned appointment ID to cancel it, then dispatch due reminders:

```bash
curl -X POST http://localhost:4000/appointments/APPOINTMENT_ID/cancel
curl -X POST http://localhost:4000/reminders/dispatch
curl http://localhost:4000/appointments/APPOINTMENT_ID
```

The appointment should be `cancelled`, its reminder should be `skipped`, and its attempt count should remain zero.

## Send a live SMS

Create a [Bird API key](https://bird.com/docs/guides/authentication), configure an SMS sender, and enable the destination country in your [Bird SMS settings](https://bird.com/docs/guides/sms/sending-sms). A free-text SMS requires both a sender and a recipient; Bird's simulated recipient `+15005550006` still requires an eligible US sender and is billed at the normal destination rate.

Store the credentials as Encore secrets:

```bash
encore secret set --type local BirdAPIKey
encore secret set --type local BirdSMSSender
```

Create a due appointment without cancelling it, then call `/reminders/dispatch`. The Pub/Sub subscriber sends the SMS through `bird.sms.send`, marks the reminder as `accepted`, and stores the returned `sms_…` message ID; later delivery outcomes arrive through the webhook.

## Receive delivery events

Create a Bird webhook endpoint for the SMS lifecycle events you need, point it at your deployed `/webhooks/bird` URL, and store the endpoint's `whsec_…` signing secret:

```bash
encore secret set --type local BirdWebhookSecret
```

Bird needs a publicly reachable HTTPS endpoint to deliver a real webhook, so local webhook verification is covered by the test suite:

```bash
npm test
encore check
```

The handler verifies `webhook-id`, `webhook-timestamp`, and `webhook-signature` against the untouched request body. It uses `webhook-id` as the database key, making Bird's at-least-once webhook delivery safe to replay.

## Learn more

- [Bird SMS documentation](https://bird.com/docs/guides/sms/overview)
- [Bird TypeScript SDK](https://bird.com/docs/sdks/typescript)
- [Bird webhook verification](https://bird.com/docs/guides/webhooks)
- [Encore Pub/Sub](https://encore.dev/docs/ts/primitives/pubsub)
- [Encore cron jobs](https://encore.dev/docs/ts/primitives/cron-jobs)
- [Encore local development](https://encore.dev/docs/ts/develop/local-development)
