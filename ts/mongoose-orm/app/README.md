# REST API Starter

This is a RESTful API Starter with a single Hello World API endpoint.

## Prerequisites 

**Install Encore:**
- **macOS:** `brew install encoredev/tap/encore`
- **Linux:** `curl -L https://encore.dev/install.sh | bash`
- **Windows:** `iwr https://encore.dev/install.ps1 | iex`

## Create app

Create a local app from this template:

```bash
encore app create my-app-name --example=ts/hello-world
```

## Run app locally

Run this command from your application's root folder:

```bash
encore run
```
### Using the API

To see that your app is running, you can ping the API.

```bash
curl http://localhost:4000/hello/World
```

### Local Development Dashboard

While `encore run` is running, open [http://localhost:9400/](http://localhost:9400/) to access Encore's [local developer dashboard](https://encore.dev/docs/observability/dev-dash).

Here you can see traces for all requests that you made, see your architecture diagram (just a single service for this simple example), and view API documentation in the Service Catalog.

## Development

### Add a new service

To create a new microservice, add a file named encore.service.ts in a new directory.
The file should export a service definition by calling `new Service`, imported from `encore.dev/service`.

```ts
import { Service } from "encore.dev/service";

export default new Service("my-service");
```

Encore will now consider this directory and all its subdirectories as part of the service.

Learn more in the docs: https://encore.dev/docs/ts/primitives/services

### Add a new endpoint

Create a new `.ts` file in your new service directory and write a regular async function within it. Then to turn it into an API endpoint, use the `api` function from the `encore.dev/api` module. This function designates it as an API endpoint.

Learn more in the docs: https://encore.dev/docs/ts/primitives/defining-apis

### Service-to-service API calls

Calling API endpoints between services looks like regular function calls with Encore.ts.
The only thing you need to do is import the service you want to call from `~encore/clients` and then call its API endpoints like functions.

In the example below, we import the service `hello` and call the `ping` endpoint using a function call to `hello.ping`:

```ts
import { hello } from "~encore/clients"; // import 'hello' service

export const myOtherAPI = api({}, async (): Promise<void> => {
  const resp = await hello.ping({ name: "World" });
  console.log(resp.message); // "Hello World!"
});
```

Learn more in the docs: https://encore.dev/docs/ts/primitives/api-calls

### Add a database

To create a database, import `encore.dev/storage/sqldb` and call `new SQLDatabase`, assigning the result to a top-level variable. For example:

```ts
import { SQLDatabase } from "encore.dev/storage/sqldb";

// Create the todo database and assign it to the "db" variable
const db = new SQLDatabase("todo", {
  migrations: "./migrations",
});
```

Then create a directory `migrations` inside the service directory and add a migration file `0001_create_table.up.sql` to define the database schema. For example:

```sql
CREATE TABLE todo_item (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT false
  -- etc...
);
```

Once you've added a migration, restart your app with `encore run` to start up the database and apply the migration. Keep in mind that you need to have [Docker](https://docker.com) installed and running to start the database.

Learn more in the docs: https://encore.dev/docs/ts/primitives/databases

### Learn more

There are many more features to explore in Encore.ts, for example:

- [Request Validation](https://encore.dev/docs/ts/primitives/validation)
- [Streaming APIs](https://encore.dev/docs/ts/primitives/streaming-apis)
- [Cron jobs](https://encore.dev/docs/ts/primitives/cron-jobs)
- [Pub/Sub](https://encore.dev/docs/ts/primitives/pubsub)
- [Object Storage](https://encore.dev/docs/ts/primitives/object-storage)
- [Secrets](https://encore.dev/docs/ts/primitives/secrets)
- [Authentication handlers](https://encore.dev/docs/ts/develop/auth)
- [Middleware](https://encore.dev/docs/ts/develop/middleware)

## Deployment

### Self-hosting

See the [self-hosting instructions](https://encore.dev/docs/self-host/docker-build) for how to use `encore build docker` to create a Docker image and configure it.

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

[Learn more in the docs](https://encore.dev/docs/how-to/github)


## Testing

To run tests, configure the `test` command in your `package.json` to the test runner of your choice, and then use the command `encore test` from the CLI. The `encore test` command sets up all the necessary infrastructure in test mode before handing over to the test runner. [Learn more](https://encore.dev/docs/ts/develop/testing)

```bash
encore test
```
