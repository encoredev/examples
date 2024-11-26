# SendGrid: Email Delivery

This is an Encore package for asynchronous sending emails via [SendGrid](https://sendgrid.com/) using Pub/Sub and the ability to flexibly configure concurrency and retry policies.

## Installation

1. Copy over the `sendgrid` package directory to your Encore application.
2. Sync your project dependencies by running `go mod tidy`.

## SendGrid API Key

You will need an [API key from SendGrid](https://docs.sendgrid.com/ui/account-and-settings/api-keys) to use this package. You can get one by signing up for a free account at https://sendgrid.com/.

Once you have the API key, set it as an Encore secret using the name `SendGridAPIKey`:

```bash
# It is good practice to separate API keys for development and production environments
$ encore secret set --dev SendGridAPIKey
Enter secret value: *****
Successfully updated development secret SendGridAPIKey.
# To set the API key for production environment
$ encore secret set --prod SendGridAPIKey
Enter secret value: *****
Successfully updated development secret SendGridAPIKey.
```
> Please note that emails will only be sent in the production environment to avoid spending your email sending limits.

## Endpoints 

The `sendgrid` package contains the following endpoints:

* `sendgrid.Send` - Send publishes an email to PubSub for further asynchronous sending using the SendGrid API.

#### Using the API
```bash
curl 'http://localhost:4000/sendgrid' \
-d '{
    "from": {
        "name": "Sender",
        "email": "sender@example.com"
    },
    "to": {
        "name": "Recipient",
        "email": "recipient@example.com"
    },
    "subject": "Sending with Twilio SendGrid is Fun",
    "text": "and easy to do anywhere, even with Encore",
    "html": "<strong>and easy to do anywhere, even with Encore</strong>"
}'
```

## Learn More

- [Encore Documentation](https://encore.dev/docs/go)
- [Pub/Sub Documentation](https://encore.dev/docs/go/primitives/pubsub)
- [SendGrid Documentation](https://docs.sendgrid.com/)