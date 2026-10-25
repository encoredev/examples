# {{name}}

Takes payments with [Stripe Checkout](https://docs.stripe.com/payments/checkout).
A checkout session sends the customer to a payment page hosted by Stripe. When
they have paid, Stripe calls this service's webhook; the service verifies the
event's signature and records the payment in the `{{ident}}` Postgres database.

Encore provisions the database and applies the migrations in `./migrations`
when the app runs.

## Routes

| Method | Path                 | What it does                                              |
| ------ | -------------------- | --------------------------------------------------------- |
| `POST` | `/{{name}}/checkout` | Create a checkout session from `{"quantity": 1}` (optional) and return its `id` and `url` |
| `POST` | `/{{name}}/webhook`  | Receive Stripe's webhook events                           |
| `GET`  | `/{{name}}/payments` | List the completed payments, newest first                 |

With `encore run` running, call the service through the service proxy at
`localhost:4000/{{name}}`:

```sh
curl -X POST http://localhost:4000/{{name}}/checkout \
  -H 'Content-Type: application/json' -d '{"quantity": 2}'
# {"id": "cs_test_...", "url": "https://checkout.stripe.com/c/pay/cs_test_..."}

curl http://localhost:4000/{{name}}/payments
```

Open the returned `url` to pay; in test mode, the card `4242 4242 4242 4242`
with any future date and CVC succeeds.

What is sold is `product` in `index.ts`, and `successUrl` and `cancelUrl` are
where Stripe sends the customer afterwards; change them to suit your app.

## Secrets

Each command reads the value from stdin:

```sh
# A secret key (sk_test_...) from https://dashboard.stripe.com/apikeys
encore secret set --service {{name}} StripeSecretKey

# The webhook endpoint's signing secret (whsec_...)
encore secret set --service {{name}} StripeWebhookSecret
```

Without `StripeSecretKey`, `POST /{{name}}/checkout` answers 503. Without
`StripeWebhookSecret`, the webhook answers 503 rather than accept an event it
cannot verify. An event whose signature does not match is rejected with 400.

## Receiving webhooks

Locally, the [Stripe CLI](https://docs.stripe.com/stripe-cli) forwards your
test-mode events and prints the signing secret to set as `StripeWebhookSecret`:

```sh
stripe listen --events checkout.session.completed,checkout.session.async_payment_succeeded \
  --forward-to localhost:4000/{{name}}/webhook
```

Once deployed, add an endpoint at `https://<your app's URL>/{{name}}/webhook` in
the [Stripe dashboard](https://dashboard.stripe.com/webhooks), listening to the
same two events, and set its signing secret for that environment.

A payment is recorded on `checkout.session.completed` when the session is paid,
and on `checkout.session.async_payment_succeeded` for payment methods that
settle later. Stripe can deliver an event more than once; each session is
recorded only once. Other events are acknowledged and ignored.
