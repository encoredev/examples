# GraphQL Starter

This starter shows how you can build a GraphQL server with Encore, implementing a basic url shortener as an example.

## Developing locally

When you have [installed Encore](https://encore.dev/docs/install), you can create a new Encore application and clone this example with this command.

```bash
encore app create my-app-name --example=graphql
```

## Running locally

Before running your application, make sure you have Docker installed and running. It's required to locally run Encore applications with databases.

```bash
encore run
```

While `encore run` is running, open [http://localhost:9400/](http://localhost:9400/) to view Encore's [local developer dashboard](https://encore.dev/docs/observability/dev-dash).

## View the GraphQL Playground
Open http://localhost:4000/graphql/playground in your browser.

## Using the API

Execute the below queries using the GraphQL Playground (or method of your choice).

#### Shorten a URL

```graphql
mutation {
  shorten(url: "https://encore.dev") {
    id
    url
  }
}
```

#### Listing all shortened URLs

```graphql
query {
  urls {
    id
    url
  }
}
```

#### Getting a URL from a shortened ID

```graphql
query {
  get(id: "some-id") {  # Use an actual ID you have
    id
    url
  }
}
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