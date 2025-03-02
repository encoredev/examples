# Encore.go SaaS Starter

This is a SaaS starter that builds upon Encore.go and [Next.js](https://nextjs.org/).

Apart from these frameworks, it also uses [Clerk](https://clerk.com/) for authentication, [Stripe](https://stripe.com/) for payments together with [Tailwind](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/) for styling and components.

## Environment Variables

### Local development

Vercel-specific environment variables are not set on local by default, so you need to add them yourself.
This can be done on the project settings page on Vercel.

Please add the following environment variables **for development**:

```env
VERCEL_ENV="development"
NEXT_PUBLIC_VERCEL_ENV="development"
VERCEL_GIT_PULL_REQUEST_ID=""
NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID=""
```
