# Encore.ts Streaming Examples

This example showcases the different streaming APIs in Encore.ts: `api.streamIn`, `api.streamOut`, and `api.streamInOut`.

Learn more in our [Streaming API docs](https://encore.dev/docs/ts/primitives/streaming-apis)

## Developing locally
### Prerequisite: Installing Encore

If this is the first time you're using Encore, you first need to install the CLI that runs the local development
environment. Use the appropriate command for your system:

- **macOS:** `brew install encoredev/tap/encore`
- **Linux:** `curl -L https://encore.dev/install.sh | bash`
- **Windows:** `iwr https://encore.dev/install.ps1 | iex`

When you have installed Encore, run to clone this example:

```bash
encore app create --example=ts/streaming
```

## Running locally
```bash
encore run
```

While `encore run` is running, open <http://localhost:4000/> to view the frontend which has different pages for showcasing the different streaming endpoints.

You can also access Encore's [local developer dashboard](https://encore.dev/docs/observability/dev-dash) on <http://localhost:9400/> to view traces, API documentation, and more.

In you change the frontend then run `npm run build` to build a new frontend in the `dist` folder.

## Deployment

Deploy your application to a staging environment in Encore's free development cloud:

```bash
git add -A .
git commit -m 'Commit message'
git push encore
```

Then head over to the [Cloud Dashboard](https://app.encore.dev) to monitor your deployment and find your production URL.

From there you can also connect your own AWS or GCP account to use for deployment.

Now off you go into the clouds!
