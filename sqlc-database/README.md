<img width="200px" src="https://encore.dev/assets/branding/logo/logo.svg" alt="Encore - The Backend Development Engine" />

# sqlc Database example

This is a basic Hello World Encore application with a single API endpoint, that uses sqlc and a SQL database to keep track of how many times you've said hello.

## Developing locally

When you have installed Encore, you can create a new Encore application and clone this example with this command.

```bash
encore app create my-app-name --example=sqlc-database
```


## Generating store code

In order to generate code in `store` package you should have installed [sqlc](https://docs.sqlc.dev/en/stable/) and create your SQL queries in `store/queries` directory.
Then just run this command from root catalog.

```shell
sqlc generate
```

## Running

To run the application, make sure you have Docker installed and running. This is required to locally run Encore applications with SQL databases.

```bash
encore run
```

## Using the API

To see that your app is running, you can ping the API.

```bash
curl http://localhost:4000/hello/There
```

## Open the developer dashboard

While `encore run` is running, open [http://localhost:9400/](http://localhost:9400/) to view Encore's [local developer dashboard](https://encore.dev/docs/observability/dev-dash).

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
