# React + Encore Web App Starter

This is an [Encore](https://encore.dev/) + [React](https://react.dev/) project starter. It's a great way to learn how to
combine Encore's backend capabilities with a modern web framework — perfect for building a web app.

## Developing locally

When you have [installed Encore](https://encore.dev/docs/install), you can create a new Encore application and clone
this example by running this command:

```bash
encore app create my-app --example=react-starter
```

### Running locally

Run your Encore backend:

```bash
encore run
```

In a different terminal window, run the React frontend using [Vite](https://vitejs.dev/):

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to see the result.

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

### Encore

Deploy your backend to a staging environment in Encore's free development cloud:

```bash
git add -A .
git commit -m 'Commit message'
git push encore
```

Then head over to the [Cloud Dashboard](https://app.encore.dev) to monitor your deployment and find your production URL.

From there you can also see metrics, traces, connect your app to a
GitHub repo to get automatic deploys on new commits, and connect your own AWS or GCP account to use for deployment.

### React on Vercel

1. Create a repo and push the project to GitHub.
2. Create a new project on Vercel and point it to your GitHup repo.
3. Select `frontend` as the root directory for the Vercel project.

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
- [React Documentation](https://react.dev/)
