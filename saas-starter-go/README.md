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

## CORS configuration

If you are running into CORS issues when calling your Encore API from your frontend then you may need to specify which
origins are allowed to access your API (via browsers). You do this by specifying the `global_cors` key in the `encore.app`
file, which has the following structure:

```json5
global_cors: {
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

```
