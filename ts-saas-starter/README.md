# Full-Stack SaaS Template with Encore.ts, BetterAuth, and Stripe

A modern, production-ready template for building subscription-based SaaS applications with TypeScript. This template combines the power of Encore.ts for backend development, BetterAuth for authentication, and Stripe for subscription management.

## Tech Stack

### Backend
- [Encore.ts](https://encore.dev/) - Microservice architecture platform
- [BetterAuth](https://github.com/better-auth/better-auth) - Authentication library
- [Stripe](https://stripe.com/) - Payment processing
- PostgreSQL - Database

### Frontend
- [Next.js 15](https://nextjs.org/) - React framework with App Router
- [React 19](https://react.dev/) - UI library
- [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible UI components
- [Lucide React](https://lucide.dev/) - Icon set

## Getting Started

Follow these steps to set up and run your SaaS application.

### Stripe Setup

1. **Create a Stripe Developer Account**
    - Head to [Stripe Dashboard](https://dashboard.stripe.com/register) and create a developer account
    - Create a recurring product subscription
    - Copy the `price_id` of your subscription product for later use

2. **Get Your API Keys**
    - From the Stripe Dashboard, copy your Secret Key (this will be your `StripeSecretKey`)

2.5. **Set up Stripe webhooks**
   - Create a webhook endpoint in your Stripe dashboard pointing to:
     ```
     https://your-domain.com/api/auth/stripe/webhook
     ```
   - Note: You don't need an actual URL at this point; this is just an example
   - `/api/auth` is the default path for the auth server
   - Make sure to select at least these events:
     * `checkout.session.completed`
     * `customer.subscription.updated`
     * `customer.subscription.deleted`

3. **Set Up Stripe CLI for Webhooks**
    - Install the [Stripe CLI](https://stripe.com/docs/stripe-cli)
    - Log in with your Stripe account:
      ```
      stripe login
      ```
    - Start the webhook forwarding:
      ```
      stripe listen --forward-to <BACKEND_URL>/api/auth/stripe/webhook
      ```
    - Save the webhook signing secret (this will be your `StripeWebhookKey`)

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Initialize Encore App**
   ```bash
   encore app init
   ```

3. **Configure Client Generation**
    - From the generated Encore config, copy your app ID
    - Update the `client` script in the backend's `package.json` with your app ID

4. **Configure Environment Variables**
    - Set up the required environment variables in Encore:
        - `StripeSecretKey`: Your Stripe Secret Key
        - `StripeWebhookKey`: Your Stripe Webhook Signing Secret
    - You want to set the environment to local

5. **Update Subscription Configuration**
    - In `encore.service.ts`, update the BetterAuth config with your Stripe `price_id`

6. **Start the Backend**
   ```bash
   npm start
   ```

7. **Generate Client File**
   ```bash
   npm client
   ```

8. **Validate Environment Keys**
   A Personal Problem of Mine was the keys on first set were not properly set, if you had to go into the dashboard to update make sure after setting you rerun the backend (npm start)

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure Backend Connection**
    - If your frontend is running on a port other than 3000, update the `trustedOrigins` in the backend's Encore auth configuration

3. **Start the Development Server**
   ```bash
   npm run dev
   ```
NOTE: When making a Stripe Payment becuase of local test redirect will not work, you can go back to the dashboard and see that the payment has been updated!

## Features

- 🔐 User Authentication with BetterAuth
- 💳 Subscription Management with Stripe
- 🚀 Type-safe API using Encore.ts
- 🎨 Modern UI with Next.js and Tailwind CSS
- 🔄 Webhook handling for subscription events
- 📱 Responsive design with mobile support

## Project Structure

```
/
├── backend/                  # Encore.ts backend
│   ├── encore.service.ts     # Main Encore service configuration
│   ├── package.json          # Backend dependencies
│   └── ...
├── frontend/                 # Next.js frontend
│   ├── lib/                  # Shared utilities
│   │   └── encore_client.ts  # Generated Encore client
│   ├── package.json          # Frontend dependencies
│   └── ...
└── README.md                 # Project documentation
```

## Acknowledgements

- [Encore](https://encore.dev/) for the backend development platform
- [BetterAuth](https://better-auth.com) for the authentication library
- [Stripe](https://stripe.com/) for payment processing
