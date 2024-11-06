# React + Encore TS Web App Starter

This is an [Encore](https://encore.dev/) + [React](https://react.dev/) project starter. It's a great way to learn how to combine Encore's backend 
capabilities with a modern web framework — perfect for building a web app.

## Developing locally

### Prerequisite: Installing Encore

If this is the first time you're using Encore, you first need to install the CLI that runs the local development
environment. Use the appropriate command for your system:

- **macOS:** `brew install encoredev/tap/encore`
- **Linux:** `curl -L https://encore.dev/install.sh | bash`
- **Windows:** `iwr https://encore.dev/install.ps1 | iex`

When you have installed Encore, run:

```bash
encore app create --example=ts/react-starter
```

## Running locally

Start the Encore backend:
```bash
encore run
```

In another terminal window, start the Vite + React frontend:
```bash
npm run dev
```

Go to <http://localhost:5173/> in the browser to see the example frontend.

You can also access Encore's [local developer dashboard](https://encore.dev/docs/observability/dev-dash) on <http://localhost:9400/> to view traces, API documentation, and more.

### Generating a request client

Keep the contract between the backend and frontend in sync by regenerating the request client whenever you make a change
to an Encore endpoint.

```bash
npm run gen # Will create a new request client app/lib/client.ts
```

## Deployment

For this starter, the backend will be deployed to Encore Cloud (or self-hosted) and the frontend to Vercel. The best way to go about doing that is to create a repo on GitHub and push the project there and then deploy the same codebase to both Encore Cloud and to Vercel.

### Encore

You can [self-host](https://encore.dev/docs/self-host/docker-build) the Encore backend or deploy it to Encore Cloud. Follow these steps to deploy your backend to a staging environment in Encore's free development cloud.

1. Create a GitHub repo, commit and push the app.
2. Open your app in the Encore [Cloud Dashboard](https://app.encore.dev).
3. Go to your app settings and link your app to GitHub and select the repo you just created.
4. Commit and push a change (can be anything) to GitHub to trigger a deploy.

You can follow the deploy in the Cloud Dashboard. When the deploy is complete, your app will be available in the cloud.

Then head over to the [Cloud Dashboard](https://app.encore.dev) to monitor your deployment and find your production URL.

From there you can also connect your own AWS or GCP account to use for deployment.

### React on Vercel

The only thing you need to do is to create a new project on Vercel and point it to your newly created GitHup repo.

## CORS configuration

If you are running into CORS issues when calling your Encore API from your frontend then you may need to specify which
origins are allowed to access your API (via browsers). You do this by specifying the `global_cors` key in the `encore.app`
file, which has the following structure:

```js
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

More information on CORS configuration can be found here: https://encore.dev/docs/develop/cors

## Learn More

- [Encore Documentation](https://encore.dev/docs)
- [Next.js Documentation](https://nextjs.org/docs)
