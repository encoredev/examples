# Next.js + Encore Web App Starter

This is an [Encore](https://encore.dev/) + [Next.js](https://nextjs.org/) project starter. It's a great way to learn how to combine Encore's backend capabilities with a modern web framework — perfect for building a web app.

## Developing locally

When you have [installed Encore](https://encore.dev/docs/install), you can create a new Encore application and clone
this example by running this command:

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

While `encore run` is running, open <http://localhost:9400/> to view Encore's local developer dashboard.
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
git push encore
```

Then head over to the [Cloud Dashboard](https://app.encore.dev) to monitor your deployment and find your production URL.

From there you can also see metrics, traces, connect your app to a
GitHub repo to get automatic deploys on new commits, and connect your own AWS or GCP account to use for deployment.

### Next.js on Vercel

1. Create a repo and push the project to GitHub
2. Create a new project on Vercel and point it to your GitHup repo
3. Select `frontend` as the root directory for the Vercel project

## Learn More

- [Encore Documentation](https://encore.dev/docs)
- [Next.js Documentation](https://nextjs.org/docs)
