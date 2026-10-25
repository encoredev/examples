# {{name}}

A webhook processor. It receives webhooks from Stripe, GitHub or any other sender, checks
their signatures, and publishes each one to a Pub/Sub topic. Two subscriptions in this
service handle every message independently (the fan-out pattern):

- `process-events` stores every event in Postgres.
- `notify-important` stores the important ones (payments, failed invoices, cancelled
  subscriptions, pushes, pull requests, releases) as notifications.

The receiving route answers as soon as the webhook is queued, so a slow database never makes
the sender time out, and a failed insert is retried by Pub/Sub.

## Signing secrets

Set the signing secret of each sender whose signatures should be checked. `encore secret set`
reads the value from stdin and sets it for this machine; restart `encore run` to pick it up:

```bash
encore secret set --service {{name}} WebhookSecretStripe   # the endpoint's "whsec_..." secret from Stripe
encore secret set --service {{name}} WebhookSecretGitHub   # the secret entered in the GitHub webhook settings
```

- **Stripe**: the `Stripe-Signature` header (`t=<timestamp>,v1=<signature>`) is the
  HMAC-SHA256 of `<timestamp>.<body>`, and must be less than five minutes old.
- **GitHub**: the `X-Hub-Signature-256` header (`sha256=<signature>`) is the HMAC-SHA256 of
  the body.

A webhook with a missing or wrong signature is rejected with `401`. Until a source's secret
is set, its webhooks are accepted without a check, and webhooks from any other source always
are, so set both before deploying: the webhook routes are exposed through the gateway.

## Routes

With `encore run` running, call the service through the service proxy at
`localhost:4000/{{name}}`:

```bash
# Receive a webhook: /{{name}}/webhooks/<source>.
curl -X POST http://localhost:4000/{{name}}/webhooks/stripe \
  -H "Content-Type: application/json" \
  -d '{"type": "payment_intent.succeeded", "data": {"object": {"amount": 2000}}}'

# A signed GitHub webhook.
SECRET="your-github-secret"
PAYLOAD='{"ref":"refs/heads/main"}'
SIG="sha256=$(printf '%s' "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" | sed 's/^.* //')"
curl -X POST http://localhost:4000/{{name}}/webhooks/github \
  -H "Content-Type: application/json" \
  -H "X-GitHub-Event: push" \
  -H "X-Hub-Signature-256: $SIG" \
  -d "$PAYLOAD"

# The 50 most recent events, and one of them.
curl http://localhost:4000/{{name}}/events
curl http://localhost:4000/{{name}}/events/1

# The 50 most recent notifications, and how many there are of each event type.
curl http://localhost:4000/{{name}}/notifications
curl http://localhost:4000/{{name}}/notifications/stats
```

To send real, signed Stripe events locally, use the [Stripe CLI](https://docs.stripe.com/stripe-cli):

```bash
stripe listen --forward-to localhost:4000/{{name}}/webhooks/stripe
stripe trigger payment_intent.succeeded
```

The event type is read from GitHub's `X-GitHub-Event` header, Stripe's `type` field, or an
`event` or `event_type` field from other senders. A body that is not a JSON object is stored as
`{"raw": "<body>"}`. Change `importantEvents` in `events.go` to choose what becomes a
notification.

## Files

- `main.go`: the HTTP server and its routes.
- `receive.go`: the receiving route and the signature checks.
- `events.go`: the database, the topic, its two subscriptions, and the read routes.
- `migrations/`: the database schema, applied by Encore before the service starts.
