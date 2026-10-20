// Payments with Stripe Checkout. A checkout session sends the customer to a
// payment page hosted by Stripe; when they have paid, Stripe calls the webhook,
// which verifies the event's signature and records the payment in Postgres.
//
//   POST /{{name}}/checkout   create a checkout session from {"quantity": 1}
//   POST /{{name}}/webhook    receive Stripe's webhook events
//   GET  /{{name}}/payments   list the completed payments
import { secret } from "@encore.dev/sdk/config";
import log from "@encore.dev/sdk/log";
import { onShutdown } from "@encore.dev/sdk/shutdown";
import { Database } from "@encore.dev/sdk/storage/postgres";
import Stripe from "stripe";

const service = "{{name}}";

// The database holding the completed payments, migrated from ./migrations
// before the service starts.
const db = new Database("{{ident}}", { migrations: "./migrations" });

// The API key checkout sessions are created with: a secret key (sk_test_...)
// or a restricted key from https://dashboard.stripe.com/apikeys.
const stripeSecretKey = secret("StripeSecretKey");

// The signing secret (whsec_...) of the webhook endpoint, which proves an
// event comes from Stripe.
const stripeWebhookSecret = secret("StripeWebhookSecret");

// What is sold. Amounts are in the currency's smallest unit: 2000 is $20.00.
// To sell a product set up in the Stripe dashboard instead, pass
// `{ price: "price_...", quantity }` as the line item.
const product = {
  name: "T-shirt",
  unitAmount: 2000,
  currency: "usd",
};

// Where Stripe sends the customer after paying, or after giving up. Stripe
// replaces {CHECKOUT_SESSION_ID} with the session's id.
const successUrl = "https://example.com/success?session_id={CHECKOUT_SESSION_ID}";
const cancelUrl = "https://example.com/cancel";

interface Payment {
  sessionId: string;
  paymentIntent: string | null;
  customerEmail: string | null;
  amountTotal: number;
  currency: string;
  paidAt: string;
}

// The Stripe client, made again when the key changes.
let client: { key: string; stripe: Stripe } | undefined;

function stripe(): Stripe | undefined {
  const key = stripeSecretKey();
  if (!key) {
    return undefined;
  }
  if (client?.key !== key) {
    client = { key, stripe: new Stripe(key) };
  }
  return client.stripe;
}

async function createCheckout(req: Request): Promise<Response> {
  const body = await readBody(req);
  const quantity = body?.quantity ?? 1;
  if (!Number.isInteger(quantity) || (quantity as number) < 1) {
    return error('the body must be JSON like {"quantity": 1}', 400);
  }

  const s = stripe();
  if (!s) {
    log.warn("StripeSecretKey is not set; not creating a checkout session");
    return error("Stripe is not configured: set the StripeSecretKey secret", 503);
  }

  try {
    const session = await s.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: quantity as number,
          price_data: {
            currency: product.currency,
            unit_amount: product.unitAmount,
            product_data: { name: product.name },
          },
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
    log.info("checkout session created", { session: session.id });
    return Response.json({ id: session.id, url: session.url }, { status: 201 });
  } catch (err) {
    if (err instanceof Stripe.errors.StripeError) {
      log.error(err, "creating the checkout session failed");
      return error(`Stripe: ${err.message}`, 502);
    }
    throw err;
  }
}

async function receiveWebhook(req: Request): Promise<Response> {
  const webhookSecret = stripeWebhookSecret();
  if (!webhookSecret) {
    log.warn("StripeWebhookSecret is not set; rejecting the webhook");
    return error("webhooks are not configured: set the StripeWebhookSecret secret", 503);
  }
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return error("the Stripe-Signature header is missing", 400);
  }

  // The signature covers the body exactly as sent, so verify the raw bytes.
  // Bun's crypto is asynchronous, hence constructEventAsync.
  const payload = new Uint8Array(await req.arrayBuffer());
  let event: Stripe.Event;
  try {
    event = await Stripe.webhooks.constructEventAsync(payload, signature, webhookSecret);
  } catch (err) {
    log.warn("rejected a webhook with a bad signature", { error: String(err) });
    return error("the signature does not match", 400);
  }

  switch (event.type) {
    case "checkout.session.completed":
      // A card payment is paid by now; a delayed one (such as a bank debit)
      // is paid when checkout.session.async_payment_succeeded arrives.
      if (event.data.object.payment_status !== "unpaid") {
        await recordPayment(event.data.object);
      }
      break;
    case "checkout.session.async_payment_succeeded":
      await recordPayment(event.data.object);
      break;
    default:
      log.debug("ignoring a webhook event", { type: event.type, event: event.id });
  }
  return Response.json({ received: true });
}

// recordPayment stores a paid session. Stripe may deliver an event more than
// once, so a session already stored is left as it is.
async function recordPayment(session: Stripe.Checkout.Session): Promise<void> {
  const paymentIntent =
    typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
  const result = await db.exec`
    INSERT INTO payments (session_id, payment_intent, customer_email, amount_total, currency)
    VALUES (${session.id}, ${paymentIntent ?? null}, ${session.customer_details?.email ?? null},
            ${session.amount_total ?? 0}, ${session.currency ?? product.currency})
    ON CONFLICT (session_id) DO NOTHING`;
  if (result.rowsAffected > 0n) {
    log.info("payment recorded", { session: session.id, amount: session.amount_total });
  }
}

async function listPayments(): Promise<Response> {
  const rows = await db.queryAll`
    SELECT session_id, payment_intent, customer_email, amount_total, currency, paid_at
    FROM payments ORDER BY paid_at DESC`;
  const payments: Payment[] = rows.map((row) => ({
    sessionId: row.session_id,
    paymentIntent: row.payment_intent,
    customerEmail: row.customer_email,
    amountTotal: Number(row.amount_total),
    currency: row.currency,
    paidAt: new Date(row.paid_at).toISOString(),
  }));
  return Response.json({ payments });
}

// readBody parses the request body as a JSON object; an empty body is an
// empty object, and anything else that is not an object is undefined.
async function readBody(req: Request): Promise<Record<string, unknown> | undefined> {
  const text = await req.text();
  if (text.trim() === "") {
    return {};
  }
  try {
    const body = JSON.parse(text);
    return body !== null && typeof body === "object" && !Array.isArray(body) ? body : undefined;
  } catch {
    return undefined;
  }
}

function error(message: string, status: number): Response {
  return Response.json({ error: message }, { status });
}

// Encore's local run supplies ENCORE_LISTEN_ADDR as host:port. Run on its own,
// this falls back to PORT and then to 8080.
function listenAddr(): { hostname?: string; port: number } {
  const addr = process.env.ENCORE_LISTEN_ADDR;
  if (addr) {
    const at = addr.lastIndexOf(":");
    return { hostname: addr.slice(0, at) || undefined, port: Number(addr.slice(at + 1)) };
  }
  return { port: Number(process.env.PORT ?? 8080) };
}

const server = Bun.serve({
  ...listenAddr(),
  routes: {
    "/{{name}}/checkout": { POST: createCheckout },
    "/{{name}}/webhook": { POST: receiveWebhook },
    "/{{name}}/payments": { GET: listPayments },
  },
  fetch: () => error("not found", 404),
  error(err) {
    log.error(err, "request failed");
    return error("internal error", 500);
  },
});

// On shutdown, finish the requests in flight.
onShutdown(() => server.stop());

console.log(`${service} listening on ${server.hostname}:${server.port}`);
