# EncoreKit: Encore SaaS Template

## Features

- Landing page with feature promotion
- Pricing page (/pricing) which connects to Stripe Checkout
- Dashboard pages with CRUD operations to modify user
- Admin role in firebase claims (admins sees activity)
- Subscription management with Stripe Customer Portal
- Authentication with firebase
- Activity logging system for any user events

## Tech stack

- Frontend Framework: [Next.js](https://nextjs.org/)
- Backend Framenwork [encore.go](https://encore.dev/go?utm_source=google&utm_medium=cpc&utm_campaign=21986726527&utm_term=encore%20go&gad_source=1&gclid=Cj0KCQiAoJC-BhCSARIsAPhdfSiHgVYvaxgmhP7cB6mdt7RaAkeRno5xU0F9stTWj9_tJBEy4lYauqIaAt0hEALw_wcB) with postgres database
- ORM: [gorm go](https://gorm.io/)
- Payments: [Stripe](https://stripe.com/)
- UI Library: [shadcn/ui](https://ui.shadcn.com/)

## Developing locally

When you have [installed Encore](https://encore.dev/docs/install), you can create a new Encore application and clone this example with this command.

```bash
encore app create my-app-name --example=encore-saas-template
```

## Running locally

### Backend

Running the backend requires the following scripts:

```bash
encore run # This has to be run to setup the postgres docker db and volume for later steps
```

```bash
pnpm i
```

Seeding the users in Firebase and Postgres. Find service-account.json in Firebase Console > Project Setting > Service Accounts > **Generate new private key**. (note: run script setup-firebase-and-users:clean to remove users)

```bash
pnpm setup-firebase-and-users --service-account "/path/to/service-account.json"
```
#### Listen to the webhook to get subscription events 
Set Stripe secrets and setup a stripe webhook (requires [Stripe CLI](https://docs.stripe.com/stripe-cli) is installed)

This command also runs stripe listen to forward stripe webhooks to our backend locally.

```bash
pnpm run setup-stripe
```

### Frontend

```bash
cd frontend
pnpm i
pnpm gen:local # generate a client for the frontend to encores cli with
pnpm dev
```

## Testing Payments

To test Stripe payments, use the following test card details:

Card Number: 4242 4242 4242 4242
Expiration: Any future date
CVC: Any 3-digit number

## Local Development Dashboard

While `encore run` is running, open <http://localhost:9400/> to access Encore's [local developer dashboard](https://encore.dev/docs/observability/dev-dash).

Here you can see API docs, make requests in the API explorer, and view traces of the responses.

## Deploying to Encore

Deploy your application to a staging environment in Encore's free development cloud:

```bash
git add .
git commit -m "first commit"
git push encore
```

### Allow Vercel domain to access Encore

Modify encore.app to look like:

```
{
	"id": "<encore-app-id>",
	"global_cors": {
		"allow_origins_with_credentials": [
			"http://127.0.0.1:3000",
			"http://localhost:3000",
			"https://<vercel-app-name>.vercel.app"
		]
	}
}
```

Then head over to the [Cloud Dashboard](https://app.encore.dev) to monitor your deployment and find your production URL.

From there you can also connect your own AWS or GCP account to use for deployment.

## Deploying to Vercel

1. Push your code to a GitHub repository.
2. Connect your repository to Vercel and deploy it.
3. Follow the Vercel deployment process, which will guide you through setting up your project.
4. **Remember to setup the env variables in Vercel**

### Allow Vercel domain to access Firebase authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Go to Authentication -> Settings
3. Add the vercel domain to authorized domains.

# Getting ready for production

## Stripe

### Set up a production Stripe webhook

1. Go to the Stripe Dashboard and create a new webhook for your production environment.
2. Set the endpoint URL to your production API route (e.g., `https://yourdomain.com/api/stripe/webhook`).
3. Select the events you want to listen for (e.g., `checkout.session.completed`, `customer.subscription.updated`).

### Configure Stripe secrets

```bash
encore secret set --type production StripeSecretKey
encore secret set --type production StripeWebhookSecret
encore secret set --type production CallbackURL
```

## Encore

Setup a production environment in [Encore's cloud dashboard](https://app.encore.cloud) and link to the branch of choice.
Then on the production branch:

```bash
git commit encore
```

### Secrets required in Encore

```bash
encore secret set --type production FirebasePrivateKey < "/path/to/service-account.json"
```

## Vercel

Remember to setup the environment variables required in Vercel.
