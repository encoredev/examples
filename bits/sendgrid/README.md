# SendGrid: Email Delivery

This is an Encore package for asynchronous sending emails via [SendGrid](https://sendgrid.com/) using Pub/Sub and the ability to flexibly configure concurrency and retry policies.

## Installation

1. Copy over the `sendgrid` package directory to your Encore application.
2. Sync your project dependencies by running `go mod tidy`.

## SendGrid API Key

You will need an [API key from SendGrid](https://docs.sendgrid.com/ui/account-and-settings/api-keys) to use this package. You can get one by signing up for a free account at https://sendgrid.com/.

Once you have the API key, set it as an Encore secret using the name `SendGridAPIKey`:

```bash
$ encore secret set --type dev,prod,local,pr SendGridAPIKey
Enter secret value: *****
Successfully updated development secret SendGridAPIKey.
```

## Endpoints 

The `sendgrid` package contains the following endpoints:

* `sendgrid.Send` - Sends an email using the SendGrid API.

#### Using the API
```bash
curl 'http://localhost:4000/sendgrid' \
-d '{
    "from": {
        "name": "Sender",
        "address": "sender@example.com"
    },
    "to": {
        "name": "Recipient",
        "address": "recipient@example.com"
    },
    "subject": "Sending with Twilio SendGrid is Fun",
    "text": "and easy to do anywhere, even with Encore",
    "html": "<strong>and easy to do anywhere, even with Encore</strong>"
}'
```

## Learn More

- [Encore Documentation](https://encore.dev/docs)
- [Pub/Sub Documentation](https://encore.dev/docs/primitives/pubsub)
- [SendGrid Documentation](https://docs.sendgrid.com/)