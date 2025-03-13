# Encore.ts SaaS Starter

This is a SaaS starter that builds upon Encore.ts and [Next.js](https://nextjs.org/).

Apart from these frameworks, it also uses [Clerk](https://clerk.com/) for authentication, [Stripe](https://stripe.com/) for payments together with [Tailwind](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/) for styling and components.

## Setting up Clerk

Create a Clerk account if you haven't already. Then, in the Clerk dashboard, create a new application.

Ensure the application is configured to support organizations, which can be enabled on the **Organization management settings** page.

### Secrets

If you host your app on Vercel (see deployment instructions further down), you can connect your Clerk application with your Vercel project under **Integrations** in the project settings on Vercel.
Don't forget to run `vercel env pull` afterward.

Otherwise, go to the *API Keys* page for your app. Copy the "Publishable Key" and one of the "Secret keys". To your frontend project, add them to the `.env.local` as

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY={PUBLISHABLE_KEY}
CLERK_SECRET_KEY={SECRET_KEY}
```

You also need to add the following environment variables to your frontend project:

```env
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
```


To add them to Encore, go to the *API Keys* page for your app. Copy the "Publishable Key" and one of the "Secret keys".

From your terminal (inside your Encore app directory), run:

```shell
$ encore secret set --prod ClerkSecretKey
```

Next, do the same for the development secret. The most secure way is to create another secret key (Clerk allows you to have multiple).
Once you have a client secret for development, set it similarly to before:

```shell
$ encore secret set --dev ClerkSecretKey
```

## Setting up Stripe

Create a Stripe account if you don't have one already. Then, create your account and make sure to set up the products and pricing plans. You must also configure the billing customer portal.

You will also need to add your backend as a webhook endpoint in Stripe and set the endpoint URL to `https://YOUR_DOMAIN/stripe/webhook`.

Currently, the pricing plans are stored in [frontend/lib/plans.ts](./frontend/lib/plans.ts), but you can also read them from Stripe or store them in a database if you prefer.

### Environment Variables

On the Stripe dashboard, go to the *Developers* page and create a new API key. Copy the "Secret Key".

From your terminal (inside your Encore app directory), run:

```shell
$ encore secret set --dev StripeSecretKey
```

To be able to verify the incoming webhook requests, you need to copy the signing secret from the Webhook page on the Stripe dashboard and add it to Encore by running:

```shell
$ encore secret set --dev StripeWebhookSigningSecret
```

Once you want to set it up for production, create a separate Secret key and Webhook Signing Secret for production and run:

```shell
$ encore secret set --prod StripeSecretKey
$ encore secret set --prod StripeWebhookSigningSecret
```

### Testing payments
To test Stripe payments, use the following test card details:

Card Number: 4242 4242 4242 4242
Expiration: Any future date
CVC: Any 3-digit number

## Developing locally

Run your Encore backend:

```bash
encore run
```

In a different terminal window, run the React frontend using [Next.js](https://nextjs.org/):

```bash
cd frontend
pnpm install
pnpm run dev
```

### Vercel Environment Variables

Vercel-specific environment variables are not set on local by default, so you need to add them yourself. This can be done on the project settings page on Vercel.

Please add the following environment variables **for development**:

```env
VERCEL_ENV="development"
NEXT_PUBLIC_VERCEL_ENV="development"
VERCEL_GIT_PULL_REQUEST_ID=""
NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID=""
```

### Generating a request client

Keep the contract between the backend and frontend in sync by regenerating the request client whenever you make a change to an Encore endpoint.

```bash
pnpm run gen # Deployed Encore staging environment
# or
pnpm run gen:local # Locally running Encore backend
```

## Deployment

### Encore

Deploy your backend to a staging environment in Encore's free development cloud:

```bash
git add -A .
git commit -m 'Commit message'
git push encore
```

Then head over to the [Cloud Dashboard](https://app.encore.dev) to monitor your deployment and find your production URL.

From there you can also see metrics, traces, connect your app to a GitHub repo to get automatic deploys on new commits, and connect your own AWS or GCP account to use for deployment.

### Next.js on Vercel

1. Create a repo and push the project to GitHub.
2. Create a new project on Vercel and point it to your GitHub repo.
3. Select `frontend` as the root directory for the Vercel project.

## CORS configuration

If you are running into CORS issues when calling your Encore API from your frontend then you may need to specify which origins are allowed to access your API (via browsers). You do this by specifying the `global_cors` key in the `encore.app` file, which has the following structure:

```json5
"global_cors": {
  // allow_origins_without_credentials specifies the allowed origins for requests
  // that don't include credentials. If nil it defaults to allowing all domains
  // (equivalent to ["*"]).
  "allow_origins_without_credentials": [
    "<ORIGIN-GOES-HERE>"
  ],

  // allow_origins_with_credentials specifies the allowed origins for requests
  // that include credentials. If a request is made from an Origin in this list
  // Encore responds with Access-Control-Allow-Origin: <Origin>.
  //
  // The URLs in this list may include wildcards (e.g. "https://*.example.com"
  // or "https://*-myapp.example.com").
  "allow_origins_with_credentials": [
    "<DOMAIN-GOES-HERE>"
  ]
}
```

More information on CORS configuration can be found here: <https://encore.dev/docs/go/develop/cors>
