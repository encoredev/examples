# Webhook Processor

A webhook ingestion and processing system built with [Encore.go](https://encore.dev), demonstrating Pub/Sub fan-out patterns.

## Architecture

This app has three services:

- **ingest** — Receives webhooks via HTTP, validates signatures, and publishes events to a Pub/Sub topic.
- **processor** — Subscribes to the topic, stores all events in Postgres, and exposes a query API.
- **notifications** — Subscribes to the same topic independently, stores important events (payments, releases, etc.) and provides stats. Demonstrates the fan-out pattern.

Both `processor` and `notifications` receive every event, but handle them differently. This is the fan-out pattern — one event published, multiple subscribers process it independently.

## Prerequisites

- [Encore CLI](https://encore.dev/docs/go/install)
- [Docker](https://docker.com) (for local Postgres databases)

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

## Signature Validation

When secrets are configured, incoming webhooks are verified using the official SDKs:

- **Stripe** — Uses the [Stripe Go SDK](https://github.com/stripe/stripe-go) (`webhook.ConstructEvent`) to verify the `Stripe-Signature` header. Stripe signs payloads using a timestamp and HMAC-SHA256 signature in the format `t=...,v1=...`.
- **GitHub** — Uses the [go-github SDK](https://github.com/google/go-github) (`github.ValidatePayloadFromBody`) to verify the `X-Hub-Signature-256` header. GitHub signs payloads with HMAC-SHA256, prefixed with `sha256=`.

Without secrets configured, all webhooks are accepted without signature checks.

## API Endpoints

### Receive a webhook

```bash
# Stripe webhook (without signature validation)
curl -X POST http://localhost:4000/webhooks/stripe \
  -H "Content-Type: application/json" \
  -d '{"type": "payment_intent.succeeded", "data": {"amount": 2000}}'

# GitHub webhook (without signature validation)
curl -X POST http://localhost:4000/webhooks/github \
  -H "Content-Type: application/json" \
  -H "X-GitHub-Event: push" \
  -d '{"ref": "refs/heads/main", "commits": []}'
```

To test with signature validation, set the secrets and include the appropriate headers:

```bash
# GitHub with signature
SECRET="your-github-secret"
PAYLOAD='{"ref":"refs/heads/main"}'
SIG="sha256=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" | awk '{print $2}')"
curl -X POST http://localhost:4000/webhooks/github \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: $SIG" \
  -H "X-GitHub-Event: push" \
  -d "$PAYLOAD"
```

For Stripe, use the [Stripe CLI](https://docs.stripe.com/stripe-cli) to forward and sign webhooks locally:

```bash
stripe listen --forward-to localhost:4000/webhooks/stripe
stripe trigger payment_intent.succeeded
```

### List processed events

```bash
curl http://localhost:4000/events
```

### Get a specific event

```bash
curl http://localhost:4000/events/1
```

### List important notifications

```bash
curl http://localhost:4000/notifications
```

### Get notification stats

```bash
curl http://localhost:4000/notifications/stats
```

## Deployment

### Self-hosting

See the [self-hosting instructions](https://encore.dev/docs/go/self-host/docker-build) for how to use `encore build docker` to create a Docker image and configure it.

### Encore Cloud Platform

Deploy your application to a free staging environment in Encore's development cloud using `git push encore`:

```bash
git add -A .
git commit -m 'Commit message'
git push encore
```

You can also open your app in the [Cloud Dashboard](https://app.encore.dev) to integrate with GitHub, or connect your AWS/GCP account, enabling Encore to automatically handle cloud deployments for you.

## Testing

```bash
encore test ./...
```
