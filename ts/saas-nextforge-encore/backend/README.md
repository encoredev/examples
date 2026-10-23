# URL Shortener Starter

This is an Encore starter for a URL Shortener. It has two API endpoints and a PostgreSQL database to store the URL IDs 
and retrieve the full URL given an ID.

## Build from scratch with a tutorial

If you prefer to built it yourself, check out the [tutorial](https://encore.dev/docs/ts/tutorials/rest-api) to learn how to build this application from scratch.

## Prerequisites 

**Install Encore:**
- **macOS:** `brew install encoredev/tap/encore`
- **Linux:** `curl -L https://encore.dev/install.sh | bash`
- **Windows:** `iwr https://encore.dev/install.ps1 | iex`
  
**Docker:**
1. [Install Docker](https://docker.com)
2. Start Docker

## Create app

Create a local app from this template:

```bash
encore app create my-app-name --example=ts/url-shortener
```

## Run app locally

Before running your application, make sure you have Docker installed and running. Then run this command from your application's root folder:

```bash
encore run
```

## Using the API

### url.shorten — Shortens a URL and adds it to the database

```bash
curl 'http://127.0.0.1:4000/url' -d '{"url":"https://google.com"}'
```

### url.get — Gets a URL from the database using a short ID

```bash
curl 'http://127.0.0.1:4000/url/:id'
```

### url.list — Lists all shortened URLs

```bash
curl 'http://127.0.0.1:4000/url'
```

## Open the developer dashboard

While `encore run` is running, open [http://localhost:9400](http://localhost:9400) to access Encore's [local developer dashboard](https://encore.dev/docs/ts/observability/dev-dash).

Here you can see API docs, make requests in the API explorer, and view traces of the responses.

## Using the API

To see that your app is running, you can ping the API to shorten a url.

```bash
curl 'http://localhost:4000/url' -d '{"url":"https://news.ycombinator.com"}'
```

When you ping the API, you will see traces and logs appearing in the local development dashboard: [http://localhost:9400](http://localhost:9400)

## Connecting to databases

You can connect to your databases via psql shell:

```bash
encore db shell <database-name> --env=local --superuser
```

Learn more in the [CLI docs](https://encore.dev/docs/ts/cli/cli-reference#database-management).

## Deployment

### Self-hosting

See the [self-hosting instructions](https://encore.dev/docs/ts/self-host/build) for how to use `encore build docker` to create a Docker image and configure it.

### Encore Cloud Platform

Deploy your application to a free staging environment in Encore's development cloud using `git push encore`:

```bash
git add -A .
git commit -m 'Commit message'
git push encore
```

You can also open your app in the [Cloud Dashboard](https://app.encore.dev) to integrate with GitHub, or connect your AWS/GCP account, enabling Encore to automatically handle cloud deployments for you.

## Link to GitHub

Follow these steps to link your app to GitHub:

1. Create a GitHub repo, commit and push the app.
2. Open your app in the [Cloud Dashboard](https://app.encore.dev).
3. Go to **Settings ➔ GitHub** and click on **Link app to GitHub** to link your app to GitHub and select the repo you just created.
4. To configure Encore to automatically trigger deploys when you push to a specific branch name, go to the **Overview** page for your intended environment. Click on **Settings** and then in the section **Branch Push** configure the **Branch name** and hit **Save**.
5. Commit and push a change to GitHub to trigger a deploy.

[Learn more in the docs](https://encore.dev/docs/platform/integrations/github)

## Testing

To run tests, configure the `test` command in your `package.json` to the test runner of your choice, and then use the command `encore test` from the CLI. The `encore test` command sets up all the necessary infrastructure in test mode before handing over to the test runner. [Learn more](https://encore.dev/docs/ts/develop/testing)

```bash
encore test
```
