# Inbound Email Workflows

This example shows how to build email workflows with [Inbound](https://inbound.new) and Encore.

## Features

- **Send transactional emails** using Inbound's API
- **Receive incoming emails** via webhooks
- **Store email history** in a PostgreSQL database
- **Reply to emails** with proper threading

## Prerequisites

1. An [Inbound](https://inbound.new) account
2. [Encore CLI](https://encore.dev/docs/install) installed

## Setup

### 1. Create an Encore app

```bash
encore app create myapp --example=ts/inbound
cd myapp
```

### 2. Configure Inbound

1. Sign up at [inbound.new](https://inbound.new)
2. Go to Settings and generate an API key
3. Add and verify your domain

### 3. Set your secret

```bash
encore secret set --dev InboundApiKey
# Paste your Inbound API key
```

### 4. Run the app

```bash
encore run
```

Open the local dashboard at http://localhost:9400 to test the APIs.

## API Endpoints

- `POST /email/send` - Send a transactional email
- `POST /email/webhook` - Receive incoming emails (configure in Inbound dashboard)
- `POST /email/reply` - Reply to an existing email
- `GET /emails` - List received emails

## Testing

### Send an email

```bash
curl -X POST http://localhost:4000/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Hello from Encore!",
    "html": "<p>This is a test email.</p>"
  }'
```

### List emails

```bash
curl http://localhost:4000/emails
```

## Setting up the Webhook

After deploying, configure Inbound to send emails to your webhook:

1. Go to the Inbound dashboard
2. Navigate to Endpoints
3. Create a new webhook endpoint pointing to `https://your-app.encorecloud.dev/email/webhook`
4. Associate it with your email address or set as catch-all

## Deployment

```bash
git add -A .
git commit -m "Add Inbound email integration"
git push encore
```

Set your production secret:

```bash
encore secret set --prod InboundApiKey
```

## Learn More

- [Inbound Documentation](https://inbound.new/docs)
- [Encore Documentation](https://encore.dev/docs)
- [Full Tutorial](https://encore.dev/blog/inbound-tutorial)
