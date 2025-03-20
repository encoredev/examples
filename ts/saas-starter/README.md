# Encore.ts SaaS Starter

This is a starter template for building a SaaS application using [Encore.ts](https://encore.dev) and [Next.js](https://nextjs.org/).

It uses [Clerk](https://clerk.com/) for authentication, has a [Stripe](https://stripe.com/) integration for payments, and uses [Tailwind](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/) for styling and components.

**Demo:** [https://encorets-saas-starter.vercel.app](https://encorets-saas-starter.vercel.app)

![SaaS Starter](https://github.com/user-attachments/assets/4fe8d1db-1938-4ea4-9fa6-e89ac66066cd)

### Features
- Marketing landing page (/)
- Pricing page (/pricing) which connects to Stripe Checkout
- Dashboard pages with (/dashboard)
- Subscription management (/dashboard/subscription)

### Tech stack
- **Backend framework:** [Encore.ts](https://encore.dev)
- **Frontend framework:** [Next.js](https://nextjs.org/)
- **Authentication:** [Clerk](https://clerk.com/)
- **Payments:** [Stripe](https://stripe.com/)
- **UI Library:** [Tailwind](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)

## Getting started 

### Install or Update Encore
Install Encore:

- **macOS:** `brew install encoredev/tap/encore`
- **Linux:** `curl -L https://encore.dev/install.sh | bash`
- **Windows:** `iwr https://encore.dev/install.ps1 | iex`

**Note**: This starter requires Encore v1.46.9+, if you have an older version installed, update using `encore version update`.

### Create app

Create a local app from this template:

```bash
encore app create my-app-name --example=ts/saas-starter
```

Then install the frontend dependencies:

```bash
cd my-app-name/frontend
pnpm install
```

If you want to host the frontend on Vercel and don't already have it installed, then you also need to install the Vercel CLI:

```bash
pnpm i -g vercel
```

## Setting up Clerk

Create a Clerk account if you haven't already. Then, in the Clerk dashboard, create a new application.

Ensure the application is configured to support organizations, which can be enabled on the **Organization management settings** page.

### Secrets

If you host your app on Vercel (see deployment instructions further down), you can connect your Clerk application with your Vercel project under **Integrations** in the project settings on Vercel. **Note**: Don't forget to run `vercel env pull` afterward.

Otherwise, go to the *API Keys* page for your app. Copy the "Publishable Key" and one of the "Secret keys". To your frontend project, add them to the `.env.local` as

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY={PUBLISHABLE_KEY}
CLERK_SECRET_KEY={SECRET_KEY}
```

You also need to add the following environment variables to your frontend project:

```
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
```


To add them to Encore, go to the *API Keys* page for your app. Copy the "Publishable Key" and one of the "Secret keys".

From your terminal (inside your `backend/` directory), run:

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

### Secrets

On the Stripe dashboard, go to the *Developers* page and create a new API key. Copy the "Secret Key".

From your terminal (inside your `backend/` directory), run:

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

### Vercel Environment Variables

Vercel-specific environment variables are not set on local by default, so you need to add them yourself. This can be done on the project settings page on Vercel.

Please add the following environment variables **for development**:

```
VERCEL_ENV="development"
NEXT_PUBLIC_VERCEL_ENV="development"
VERCEL_GIT_PULL_REQUEST_ID=""
NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID=""
```

## Run locally

Run your Encore backend:

```bash
cd backend
encore run
```

**Note**: This will fail unless you set up the Stripe and Clerk secrets according to the instructions above.

In a different terminal window, run the React frontend using [Next.js](https://nextjs.org/):

```bash
cd frontend
pnpm run dev
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

## Frontend & CORS configuration

The backend needs to know where the frontend is hosted, in order to serve the correct redirect URLs
back from Stripe. It is also necessary for CORS to work correctly.

To handle this, you need to update two configuration files.

First, update the `FRONTEND_URL` constant in `backend/config.ts` to point to where your frontend is hosted.

Secondly, if you are running into CORS issues when calling your Encore API from your frontend then you may need to specify which origins are allowed to access your API (via browsers). You do this by specifying the `global_cors` key in the `backend/encore.app` file, which has the following structure:

```json
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

Both of these default to "https://encorets-saas-starter.vercel.app" which is the hosted demo application.

More information on CORS configuration can be found here: <https://encore.dev/docs/ts/develop/cors>
