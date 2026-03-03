# Polar + Encore Starter

Accept payments and subscriptions with [Polar](https://polar.sh) and [Encore](https://encore.dev). Polar handles monetization as your Merchant of Record. Encore handles infrastructure.

## What's included

- **Polar SDK** initialized with an Encore secret
- **Checkout endpoint** that creates Polar checkout sessions
- **Webhook handler** that validates signatures and processes subscription events
- **Frontend** at `/` with a checkout form

## Prerequisites

You'll need a [Polar](https://polar.sh) account. For development, use the [sandbox dashboard](https://sandbox.polar.sh):

1. **Create a product.** Go to [Products](https://sandbox.polar.sh/products) and create a product. Copy the **product ID**, you'll paste it in the checkout form.
2. **Create an access token.** Go to Settings > [Developers > Personal Access Tokens](https://sandbox.polar.sh/settings/developers/pat).
3. **Create a webhook** (optional). Go to Settings > [Webhooks](https://sandbox.polar.sh/settings/webhooks). Point it to your API URL followed by `/webhook/polar`. For local dev, use [ngrok](https://ngrok.com) or similar to expose your local server.

## Get started

1. Install Encore if you haven't already:
   ```bash
   curl -L https://encore.dev/install.sh | bash
   ```

2. Create a new app from this example:
   ```bash
   encore app create --example=ts/polar
   ```

3. Set your Polar access token:
   ```bash
   encore secret set --type local PolarAccessToken
   ```

4. Run the app:
   ```bash
   encore run
   ```

5. Open http://localhost:4000 to create a test checkout. Paste your product ID and enter a test email.

## Learn more

- [Polar + Encore integration guide](https://encore.dev/docs/ts/develop/integrations/polar)
- [Polar documentation](https://docs.polar.sh)
- [Polar sandbox dashboard](https://sandbox.polar.sh)
- [Encore secrets docs](https://encore.dev/docs/ts/primitives/secrets)
