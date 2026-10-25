# {{name}}

Sends transactional email through [Resend](https://resend.com). Sending an
email publishes it on the `{{kebab}}-emails` Pub/Sub topic and returns at once.
The `{{kebab}}-send-email` subscription, in this same service, delivers it
through Resend in the background, and a failed send is retried.

Encore provisions the topic and the subscription when the app runs.

## Routes

| Method | Path             | What it does                                                        |
| ------ | ---------------- | ------------------------------------------------------------------- |
| `POST` | `/{{name}}/send` | Queue an email from `{"to": "...", "subject": "...", "html": "..."}` |

With `encore run` running, call the service through the service proxy at
`localhost:4000/{{name}}`:

```sh
curl -X POST http://localhost:4000/{{name}}/send \
  -H 'Content-Type: application/json' \
  -d '{"to": "you@example.com", "subject": "Hello", "html": "<p>Hi from Encore!</p>"}'
# {"message": "Email queued for you@example.com"}
```

The route answers 202 once the email is queued; the logs show when it is sent.

## Sending the email

Without a Resend API key the service runs as is: the subscription logs the
email it would have sent. To send it, create a key at
https://resend.com/api-keys and set it (the command reads the value from stdin):

```sh
encore secret set --service {{name}} ResendApiKey
```

The sender is `fromAddress` in `index.ts`. It starts as
`onboarding@resend.dev`, Resend's test address, which works with any API key
but only delivers to the address of your own Resend account. To send to anyone,
[verify your domain](https://resend.com/domains) and change `fromAddress` to an
address on it.
