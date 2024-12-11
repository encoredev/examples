# Middleware Demo

This is the code example used in the middleware demo [stream](https://www.youtube.com/watch?v=qInxenZVDJs). It demonstrates how to implement a simple authorization middleware that only allows users to update themselves while still being able to view other users in the system.

All endpoints require authentication, pass the string `userid:1` in the authorization header to login as user with id 1. Replace 1 with any number.

**Endpoints:**

- `/users` (POST) - Create a new user
- `/users` (GET) - List all users
- `/users/:id` (GET) - Get user by id
- `/users/:id` (PUT) - Update user by id
- `/users/:id` (DELETE) - delete user by id


## Developing locally

### Prerequisite: Installing Encore

If this is the first time you're using Encore, you first need to install the CLI that runs the local development
environment. Use the appropriate command for your system:

- **macOS:** `brew install encoredev/tap/encore`
- **Linux:** `curl -L https://encore.dev/install.sh | bash`
- **Windows:** `iwr https://encore.dev/install.ps1 | iex`

When you have installed Encore, run:

```bash
encore app create --example=ts/middleware-demo
```

## Running locally

Before running your application, make sure you have Docker installed and running. It's required to locally run Encore applications with databases.

```bash
encore run
```

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

## Testing

```bash
encore test
```

