# Webhook Processor

A webhook ingestion and processing system built with [Encore.ts](https://encore.dev), demonstrating Pub/Sub fan-out patterns.

## Architecture

This app has three services:

- **ingest** — Receives webhooks via HTTP, validates signatures, and publishes events to a Pub/Sub topic.
- **processor** — Subscribes to the topic, stores all events in Postgres, and exposes a query API.
- **notifications** — Subscribes to the same topic independently, stores important events (payments, releases, etc.) and provides stats. Demonstrates the fan-out pattern.

Both `processor` and `notifications` receive every event, but handle them differently. This is the fan-out pattern — one event published, multiple subscribers process it independently.

## Getting Started

1. Optionally set webhook secrets for signature validation:

```bash
encore secret set --type dev,local,pr,prod WebhookSecretStripe
encore secret set --type dev,local,pr,prod WebhookSecretGitHub
```

2. Run the app:

```bash
encore run
```

The Postgres databases are provisioned automatically on startup. No manual database setup required.

Open [http://localhost:4000](http://localhost:4000) for usage instructions, or [http://localhost:9400](http://localhost:9400) for the Local Dashboard. When deployed to [Encore Cloud](https://app.encore.cloud), use the Service Catalog to call endpoints and view traces to see how requests flow between services.

## API Endpoints

### Receive a webhook

```bash
curl -X POST http://localhost:4000/webhooks/stripe \
  -H "Content-Type: application/json" \
  -d '{"type": "payment_intent.succeeded", "data": {"object": {"amount": 2000}}}'
```

### List processed events

```bash
curl http://localhost:4000/webhooks/events
```

### Get a specific event

```bash
curl http://localhost:4000/webhooks/events/1
```

### List important notifications

```bash
curl http://localhost:4000/notifications
```

### Get notification stats

```bash
curl http://localhost:4000/notifications/stats
```
