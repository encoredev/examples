# Next.js + Encore Web App Starter

This is an [Encore.go](https://encore.dev/) + [Next.js](https://nextjs.org/) project starter. It's a great way to learn how to combine Encore's backend capabilities with a modern web framework — perfect for building a web app.

## Prerequisites 

- **Install Encore:**
  - **macOS:** `brew install encoredev/tap/encore`
  - **Linux:** `curl -L https://encore.dev/install.sh | bash`
  - **Windows:** `iwr https://encore.dev/install.ps1 | iex`
  
- **Docker:**
  - 1. Install [Docker](https://docker.com)
  - 2. Start Docker

## Create app

Create a local app from this template:

```bash
encore app create my-app --example=nextjs-starter
```

### Running locally

Run your Encore backend:
```bash
encore run
```

In a different terminal window, run the Next.js frontend:
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Encore's Local Development Dashboard

While `encore run` is running, open [http://localhost:9400/](http://localhost:9400/) to view Encore's local developer dashboard.
Here you can see the request you just made and a view a trace of the response.

### Generating a request client

Keep the contract between the backend and frontend in sync by regenerating the request client whenever you make a change
to an Encore endpoint.

```bash
npm run gen # Deployed Encore staging environment
# or
npm run gen:local # Locally running Encore backend
```

## Deployment

### Encore: Self-hosting

See the [self-hosting instructions](https://encore.dev/docs/go/self-host/docker-build) for how to use `encore build docker` to create a Docker image and configure it.

### Encore: Cloud Platform

Deploy your application to a free staging environment in Encore's development cloud using `git push encore`:

```bash
git add -A .
git commit -m 'Commit message'
git push encore
```

You can also open your app in the [Cloud Dashboard](https://app.encore.dev) to integrate with GitHub, or connect your AWS/GCP account, enabling Encore to automatically handle cloud deployments for you.

### Next.js on Vercel

1. Create a repo and push the project to GitHub
2. Create a new project on Vercel and point it to your GitHup repo
3. Select `frontend` as the root directory for the Vercel project

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

More information on CORS configuration can be found here: https://encore.dev/docs/go/develop/cors

## Learn More

- [Encore Documentation](https://encore.dev/docs/go)
- [Next.js Documentation](https://nextjs.org/docs)
