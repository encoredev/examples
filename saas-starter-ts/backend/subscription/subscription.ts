import { api, Header } from "encore.dev/api";
import { secret } from "encore.dev/config";
import log from "encore.dev/log";
import { IncomingMessage } from "http";
import Stripe from "stripe";

const stripeSecretKey = secret('StripeSecretKey')
//const stripeWebhookSigningSecret = secret('StripeWebhookSigningSecret')
const stripeWebhookSigningSecret = () => 'whsec_052d37aa1d2c923118e2ae534ad2c03de84edfc4663b76103e459224cba94664';

const stripe = new Stripe(stripeSecretKey());


// Extract the body from an incoming request.
function getBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve) => {
    const bodyParts: any[] = [];
    req
      .on("data", (chunk) => {
        bodyParts.push(chunk);
      })
      .on("end", () => {
        resolve(Buffer.concat(bodyParts).toString());
      });
  });
}

export const stripeWebhookHandler = api.raw({
  method: "POST",
  expose: true,
}, async (req, res) => {
  const body = await getBody(req)
  const stripeSignature = req.headers['stripe-signature'] as string;

  const event = stripe.webhooks.constructEvent(body, stripeSignature, stripeWebhookSigningSecret())

  log.debug('received stripe webhook', { event })

  if (event.type === 'checkout.session.completed') {
  }


  res.writeHead(200)
});
