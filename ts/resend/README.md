# Resend + Encore Starter

Send transactional emails with [Resend](https://resend.com) and [Encore](https://encore.dev). Emails are delivered asynchronously via Pub/Sub so your API endpoints stay fast.

## What's included

- **Resend SDK** initialized with an Encore secret
- **Pub/Sub topic** for async email delivery with automatic retries
- **Send endpoint** that publishes email events and returns immediately
- **Frontend** at `/` with a form to send test emails

## Prerequisites

You'll need a [Resend](https://resend.com) account:

1. **Create an API key** — Go to [API Keys](https://resend.com/api-keys) and create a new key.
2. **Verify a domain** (optional for testing) — Go to [Domains](https://resend.com/domains) to add your sending domain. Until you verify a domain, the example uses `onboarding@resend.dev` as the default sender, which works with any Resend API key.

## Get started

1. Install Encore if you haven't already:
   ```bash
   curl -L https://encore.dev/install.sh | bash
   ```

2. Create a new app from this example:
   ```bash
   encore app create --example=ts/resend
   ```

3. Set your Resend API key:
   ```bash
   encore secret set --type local ResendAPIKey
   ```

4. Run the app:
   ```bash
   encore run
   ```

5. Open http://localhost:4000 to send a test email.

## Customizing the sender address

The example defaults to `onboarding@resend.dev` (Resend's built-in test sender). To use your own address, [verify your domain](https://resend.com/domains) in Resend and update the `from` field in `email/topic.ts`.

## Learn more

- [Resend + Encore integration guide](https://encore.dev/docs/ts/develop/integrations/resend)
- [Resend documentation](https://resend.com/docs)
- [Encore Pub/Sub docs](https://encore.dev/docs/ts/primitives/pubsub)
- [Encore secrets docs](https://encore.dev/docs/ts/primitives/secrets)
