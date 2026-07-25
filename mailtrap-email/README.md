# Send Email with Mailtrap

This example shows how to send transactional emails using [Mailtrap's Email API](https://mailtrap.io) with Encore.

## Prerequisites

- A [Mailtrap account](https://mailtrap.io/signup)
- A verified [sending domain](https://mailtrap.io/sending/domains)
- A Mailtrap API token from [API settings](https://mailtrap.io/api-tokens)

## Setup

1. Clone and install the example:
```bash
   encore app create my-app --example=mailtrap-email
   cd my-app
```

2. Set your Mailtrap API token as an Encore secret:
```bash
   encore secret set --type local,dev,prod MailtrapAPIToken
```

3. Run the app locally:
```bash
   encore run
```

## Send an email

Call the API endpoint to send an email:

```bash
curl -X POST http://localhost:4000/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com",
    "subject": "Hello from Encore + Mailtrap",
    "body": "This email was sent using Mailtrap Email API and Encore."
  }'
```

## Using Mailtrap Sandbox for testing

To test emails safely without delivering to real inboxes, use Mailtrap's Sandbox API by setting the `MAILTRAP_SANDBOX` environment variable to `true` and providing your `MAILTRAP_INBOX_ID`.

## Learn more

- [Mailtrap Email API docs](https://mailtrap.io/docs)
- [Encore documentation](https://encore.dev/docs)
