# Template Engine with Encore.ts

This example utilizes a Raw endpoint to handle serve views through a template engine. This example uses the [EJS](https://ejs.co/) for rendering views but the same concept could be used for a different template engine.

## Developing locally

### Prerequisite: Installing Encore

If this is the first time you're using Encore, you first need to install the CLI that runs the local development
environment. Use the appropriate command for your system:

- **macOS:** `brew install encoredev/tap/encore`
- **Linux:** `curl -L https://encore.dev/install.sh | bash`
- **Windows:** `iwr https://encore.dev/install.ps1 | iex`

When you have installed Encore, run:

```bash
encore app create --example=ts/template-engine
```

## Running locally

```bash
encore run
```

**Pages:**

- <http://localhost:4000/person> - Serving a specific view with data
- <http://localhost:4000/> - Serving a template based on the dynamic path
- <http://localhost:4000/about/contact> - Serving a template located in a sub-folder
- <http://localhost:4000/html> - Serving an inline HTML template

Go to [http://localhost:4000](http://localhost:4000) in the browser to see the example frontend.

You can also access Encore's [local developer dashboard](https://encore.dev/docs/observability/dev-dash) on <http://localhost:9400/> to view traces, API documentation, and more.

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
