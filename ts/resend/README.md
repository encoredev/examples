# Resend Email Integration

This example demonstrates how to build a production-ready email service using [Resend](https://resend.com/) and Encore.

## Features

- **Transactional Emails** - Send welcome emails, password resets, and notifications
- **React Email Templates** - Type-safe, component-based email design
- **Email Tracking** - PostgreSQL database for email history
- **Webhook Handling** - Track delivery, bounces, and complaints
- **Batch Emails** - Send to multiple recipients efficiently
- **Domain Verification** - Set up custom sending domains

## Build from scratch with a tutorial

If you prefer, check out the [full tutorial](https://encore.dev/blog/resend-tutorial) to learn how to build this application from scratch.

## Prerequisites

**Install Encore:**
- **macOS:** `brew install encoredev/tap/encore`
- **Linux:** `curl -L https://encore.dev/install.sh | bash`
- **Windows:** `iwr https://encore.dev/install.ps1 | iex`

**Docker:**
- Install [Docker](https://docker.com)
- Start Docker

**Resend Account:**
- Sign up at [resend.com](https://resend.com/)
- Create an API key in the dashboard
- (Optional) Verify your domain for production use

## Running locally

1. Install dependencies:
```bash
npm install
```

2. Set your Resend API key:
```bash
encore secret set --dev ResendApiKey
```

3. Start the backend (make sure Docker is running):
```bash
encore run
```

4. Send a test email:
```bash
curl -X POST http://localhost:4000/email/welcome \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your-verified-email@gmail.com",
    "name": "Test User",
    "loginUrl": "https://example.com/login"
  }'
```

**Note:** Replace `your-verified-email@gmail.com` with the email you used to sign up for Resend, or any email on your verified domain.

## API Endpoints

- `POST /email/welcome` - Send welcome email
- `POST /email/password-reset` - Send password reset email  
- `GET /email/list` - List sent emails
- `POST /webhooks/resend` - Handle Resend webhooks

## Project Structure

```
├── email/                      # Email service
│   ├── encore.service.ts      # Service definition
│   ├── resend.ts              # Resend client setup
│   ├── db.ts                  # Database connection
│   ├── send.ts                # Email sending endpoints
│   ├── webhooks.ts            # Webhook handler
│   ├── migrations/            # Database schema
│   └── templates/             # React Email templates
│       ├── welcome.tsx
│       └── password-reset.tsx
├── encore.app                 # App configuration
├── package.json               # Dependencies
└── tsconfig.json              # TypeScript config
```

## Local Development Dashboard

Open `http://localhost:9400` to access Encore's local development dashboard with:

- API Explorer with interactive documentation
- Service architecture diagram
- Distributed tracing for all requests (including Resend API calls)
- Database explorer to browse email history

## Webhook Configuration

To receive delivery status updates from Resend:

1. Deploy your application (see below)
2. In your Resend dashboard, navigate to **Webhooks**
3. Add webhook URL: `https://your-domain.com/webhooks/resend`
4. Select events: `email.sent`, `email.delivered`, `email.opened`, `email.clicked`, `email.bounced`, `email.complained`

## Deployment

### Self-hosting

See the [self-hosting instructions](https://encore.dev/docs/how-to/self-host) for how to use `encore build docker` to create a Docker image and configure it.

### Encore Cloud Platform

Deploy your application to a free staging environment in Encore's development cloud using `git push encore`:

```bash
git add -A .
git commit -m 'Commit message'
git push encore
```

Set your production secret:
```bash
encore secret set --prod ResendApiKey
```

You can also open your app in the [Cloud Dashboard](https://app.encore.cloud) to integrate with GitHub, or connect your AWS/GCP account, enabling Encore to automatically handle cloud deployments for you.

## Learn More

- [Full tutorial](https://encore.dev/blog/resend-tutorial) - Step-by-step guide
- [Encore Documentation](https://encore.dev/docs) - Learn about Encore features
- [Resend Docs](https://resend.com/docs) - Explore more email features
- [React Email](https://react.email/) - Build beautiful email templates

