# Send Email with Mailtrap

This example shows how to send transactional emails using [Mailtrap's Email API](https://mailtrap.io) with Encore.

## Prerequisites

- A [Mailtrap account](https://mailtrap.io/signup)
- A verified [sending domain](https://mailtrap.io/sending/domains)
- A Mailtrap API token from [API settings](https://mailtrap.io/api-tokens)

## Setup

1. Copy the `email` folder into your Encore app so it becomes an `email` service.

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

> **Note:** The `from` address in `email/email.go` is a placeholder. Replace it with an address on your verified sending domain. The endpoint is public for demonstration; add authentication or make it `private` before deploying.

## Learn more

- [Mailtrap Email API docs](https://docs.mailtrap.io/)
- [Encore documentation](https://encore.dev/docs)
