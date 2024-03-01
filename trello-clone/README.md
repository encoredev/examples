# Microservices Backend Starter

Building microservices applications can be a pain because you normally have to deal with a lot of boilerplate and it can be hard to ensure end-to-end type-safety.
This template lets you deploy a fully type-safe microservices application in Go, implementing the backend for a Trello application as an example.

The backend in this starter has two services, each with a couple of API endpoints and their own databases.

This is what the architecture looks like:

![Architecture Diagram](https://encore.dev/assets/github/trello-clone.png)

## Developing locally

When you have [installed Encore](https://encore.dev/docs/install), you can create a new Encore application and clone this example with this command.

```bash
encore app create my-app-name --example=trello-clone
```

## Running locally

Before running the application, make sure you have synced the project dependencies by running `go mod tidy` and that Docker is 
installed and running. Docker is required when running Encore applications locally that uses SQL databases.

To start the Encore application, run:

```bash
encore run
```

While `encore run` is running, open [http://localhost:9400/](http://localhost:9400/) to view Encore's [local developer dashboard](https://encore.dev/docs/observability/dev-dash).

## Defining services

With Encore you create a service by [defining one or more APIs](https://encore.dev/docs/primitives/services-and-apis#defining-apis) within a regular Go package. Encore recognizes this as a service and uses the package name as the service name.

When deploying, Encore automatically [provisions the required infrastructure](https://encore.dev/docs/deploy/infra) for each service.

## Using Databases with Encore

Encore treats SQL databases as logical resources and natively supports **PostgreSQL** databases.

To create a database, import `encore.dev/storage/sqldb` and call `sqldb.NewDatabase`, assigning the result to a package-level variable.
Databases must be created from within an [Encore service](https://encore.dev/docs/primitives/services-and-apis).

You [define the schema](https://encore.dev/docs/primitives/databases#defining-a-database-schema) by creating a migration file. Encore takes care of [provisioning the database](https://encore.dev/docs/primitives/databases#provisioning-databases), running new schema migrations during deploys, and connecting to it.

## Using the API

To see that your app is running, you can ping the `board.Create` endpoint to create a Trello board.

```bash
curl 'http://localhost:4000/board.Create' -d '{"Name":"my board"}'
```

## Open the developer dashboard

While `encore run` is running, open [http://localhost:9400/](http://localhost:9400/) to view Encore's [local development dashboard](https://encore.dev/docs/observability/dev-dash). Here you can see the request you just made and view a trace of the response.

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
