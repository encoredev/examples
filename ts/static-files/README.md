# Serving static files with Encore.ts

This is an example of how to use `api.static` in Encore.ts to serve static files.

Learn more in our [Static Assets docs](https://encore.dev/docs/ts/primitives/static-assets)

## Developing locally

### Prerequisite: Installing Encore

If this is the first time you're using Encore, you first need to install the CLI that runs the local development
environment. Use the appropriate command for your system:

- **macOS:** `brew install encoredev/tap/encore`
- **Linux:** `curl -L https://encore.dev/install.sh | bash`
- **Windows:** `iwr https://encore.dev/install.ps1 | iex`

When you have installed Encore, run:

```bash
encore app create --example=ts/static-files
```

## Running locally
```bash
encore run
```

While `encore run` is running, open <http://localhost:9400/> to view Encore's [local developer dashboard](https://encore.dev/docs/ts/observability/dev-dash).

## Using the endpoints

Go to [http://localhost:4000](http://localhost:4000) in the browser to see the example frontend.

Static files are also served on `/public`, try opening [http://localhost:4000/public/styles.css](http://localhost:4000/public/styles.css) in the browser to see the CSS file.

Go to [http://localhost:4000/does-not-exist](http://localhost:4000/does-not-exist) to see the `not_found.html` 404 page.

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
