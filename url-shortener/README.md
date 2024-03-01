# URL Shortener Starter

This is an Encore starter for a URL Shortener. It has two API endpoints and a PostgreSQL database to store the URL IDs and retrieve the full URL given an ID.

## Build from scratch with a tutorial

If you prefer to built it yourself, check out the [tutorial](https://encore.dev/docs/tutorials/rest-api) to learn how to build this application from scratch.

## Developing locally

When you have [installed Encore](https://encore.dev/docs/install), you can create a new Encore application and clone this example with this command.

```bash
encore app create my-app-name --example=url-shortener
```

## Running locally

Before running your application, make sure you have Docker installed and running. It's required to locally run Encore applications with databases.

```bash
encore run
```

## Open the developer dashboard

While `encore run` is running, open [http://localhost:9400/](http://localhost:9400/) to access Encore's [local developer dashboard](https://encore.dev/docs/observability/dev-dash).

Here you can see API docs, make requests in the API explorer, and view traces of the responses.

## Using the API

To see that your app is running, you can ping the API to shorten a url.

```bash
curl 'http://localhost:4000/url' -d '{"URL":"https://news.ycombinator.com"}'
```

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

## Testing

```bash
encore test ./...
```