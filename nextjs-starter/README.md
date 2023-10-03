This is an [Encore](https://encore.dev/) + [Next.js](https://nextjs.org/) project starter

## Developing locally

When you have [installed Encore](https://encore.dev/docs/install), you can create a new Encore application and clone
this example by running this command:

```bash
encore app create my-app --example=nextjs-starter
```

### Running

```bash
# Run the Encore backend
encore run

# In a different terminal window, run the Next.js frontend
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Encore developer dashboard

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

Deploy your backend to a staging environment in Encore's free development cloud.

```bash
git push encore
```

You can view your backend deploys, metrics and traces <https://app.encore.dev>.

### Next.js on Vercel

...

## Learn More

- [Encore Documentation](https://encore.dev/docs)
- [Next.js Documentation](https://nextjs.org/docs)
