# GraphQL Starter

This starter shows how you can build an Apollo GraphQL server with Encore.ts, implementing a basic book CRUD service as an example.

The concept would be the same if you want to use another GraphQL library: 
1. Take client requests with a Raw endpoint.
2. Pass along the request and response objects to the GraphQL library of your choice.
3. Use the library to handle the GraphQL queries and mutations.
4. Return the GraphQL response from the Raw endpoint.

## Developing locally

### Prerequisite: Installing Encore

If this is the first time you're using Encore, you first need to install the CLI that runs the local development
environment. Use the appropriate command for your system:

- **macOS:** `brew install encoredev/tap/encore`
- **Linux:** `curl -L https://encore.dev/install.sh | bash`
- **Windows:** `iwr https://encore.dev/install.ps1 | iex`

When you have installed Encore, run:

```bash
encore app create --example=ts/graphql
```

## Running locally
```bash
encore run
```

While `encore run` is running, open <http://localhost:9400/> to view Encore's [local developer dashboard](https://encore.dev/docs/observability/dev-dash).

In you change the GraphQL schema, run the below command to re-generate the types:
```bash
npm run generate
```

## View the GraphQL Playground

To easily call the GraphQL API, open <https://studio.apollographql.com/sandbox> in your browser and set http://localhost:4000/graphql as your endpoint. You should then be able to read the schema and execute queries.

## Using the API

Execute the below queries using the GraphQL Playground (or method of your choice).
#### Add a books

```graphql
mutation AddBook {
  addBook(author: "J.R.R. Tolkien", title: "The Hobbit") {
    success
    message
    code
  }
}
```

#### Listing all books

```graphql
query GetBooks {
  books {
    author
    title
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
