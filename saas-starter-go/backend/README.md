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
encore app create my-app-name --example=hello-world
```

## Run app locally

Run this command from your application's root folder:

```bash
encore run
```
## Using the API

To see that your app is running, you can ping the API.

```bash
curl http://localhost:4000/hello/World
```

### Local Development Dashboard

While `encore run` is running, open [http://localhost:9400/](http://localhost:9400/) to access Encore's [local developer dashboard](https://encore.dev/docs/go/observability/dev-dash).

Here you can see traces for all requests that you made, see your architecture diagram (just a single service for this simple example), and view API documentation in the Service Catalog.

## Development

### Add a new service

With Encore.go you can create a new service by creating a regular Go package and then defining at least one API within it. Encore recognizes this as a service, and uses the package name as the service name.

On disk it might look like this:

```
/my-app
├── encore.app          // ... and other top-level project files
│
├── hello               // hello service (a Go package)
│   ├── hello.go        // hello service code
│   └── hello_test.go   // tests for hello service
│
└── world               // world service (a Go package)
    └── world.go        // world service code
```

Learn more in the docs: https://encore.dev/docs/go/primitives/services

### Create an API endpoint

With Encore.go you can turn a regular Go function into an API endpoint by adding the `//encore:api` annotation to it. This tells Encore that the function should be exposed as an API endpoint and Encore will automatically generate the necessary boilerplate at compile-time.

For example, in this app you app will have a `hello` service with a `Ping` API endpoint:

```go
//encore:api public path=/hello/:name
func World(ctx context.Context, name string) (*Response, error) {
	msg := "Hello, " + name + "!"
	return &Response{Message: msg}, nil
}

type Response struct {
	Message string
}
```

You can define different access controls using:
- `//encore:api public` - Public API endpoint
- `//encore:api private` - Defines a private API that is never accessible to the outside world. It can only be called from other services in your app
- `//encore:api auth` - Defines an API that anybody can call, but requires valid authentication

Learn more in the docs: https://encore.dev/docs/go/primitives/defining-apis

### Service-to-service API calls

Calling an API endpoint looks like a regular function call with Encore.go. To call an endpoint you first import the other service as a Go package using `import "encore.app/package-name"`.

In the example below, we import the service `hello` and call the `Ping` endpoint using a function call to `hello.Ping`:

```go
import "encore.app/hello" // import service

//encore:api public
func MyOtherAPI(ctx context.Context) error {
    resp, err := hello.Ping(ctx, &hello.PingParams{Name: "World"})
    if err == nil {
        log.Println(resp.Message) // "Hello, World!"
    }
    return err
}
```

Learn more in the docs: https://encore.dev/docs/go/primitives/api-calls

### Add a database

To create a database, import `encore.dev/storage/sqldb` and call `new SQLDatabase`, assigning the result to a top-level variable. For example:

```go
import "encore.dev/storage/sqldb"

// Create the todo database and assign it to the "tododb" variable
var tododb = sqldb.NewDatabase("todo", sqldb.DatabaseConfig{
	Migrations: "./migrations",
})
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

Learn more in the docs: https://encore.dev/docs/go/primitives/databases

### Learn more

There are many more features to explore in Encore.go, for example:

- [Cron jobs](https://encore.dev/docs/go/primitives/cron-jobs)
- [Pub/Sub](https://encore.dev/docs/go/primitives/pubsub)
- [Object Storage](https://encore.dev/docs/go/primitives/object-storage)
- [Secrets](https://encore.dev/docs/go/primitives/secrets)
- [Authentication handlers](https://encore.dev/docs/go/develop/auth)
- [Middleware](https://encore.dev/docs/go/develop/middleware)

## Deployment

### Self-hosting

See the [self-hosting instructions](https://encore.dev/docs/go/self-host/docker-build) for how to use `encore build docker` to create a Docker image and configure it.

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

```bash
encore test ./...
```