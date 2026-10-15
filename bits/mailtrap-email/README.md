# Send Email with Mailtrap

This example shows how to send transactional emails using [Mailtrap's Email API](https://mailtrap.io) with Encore.

## Prerequisites

- A [Mailtrap account](https://mailtrap.io/signup)
- A verified [sending domain](https://mailtrap.io/sending/domains)
- A Mailtrap API token from [API settings](https://mailtrap.io/api-tokens)

## Setup

1. Copy the `email` folder into your Encore app so it becomes an `email` service.

2. Set your Mailtrap API token and a sender address on your verified sending domain as Encore secrets:
```bash
   encore secret set --type local,dev,prod MailtrapAPIToken
   encore secret set --type local,dev,prod MailtrapFromEmail
```

3. Run the app locally:
```bash
   encore run
```

## Send an email

The `Send` endpoint is `private`, so only other services in your Encore app can call it. It isn't exposed to the internet. Call it from another service like this:

```go
   import "encore.app/email"

   _, err := email.Send(ctx, &email.SendParams{
       To:      "recipient@example.com",
       Subject: "Hello from Encore + Mailtrap",
       Body:    "This email was sent using Mailtrap Email API and Encore.",
   })
```

The import path assumes the default Encore module name `encore.app`. Adjust it if your `go.mod` differs. If you expose a sending endpoint publicly, add authentication first.

## Learn more

- [Mailtrap Email API docs](https://docs.mailtrap.io/)
- [Encore documentation](https://encore.dev/docs)
