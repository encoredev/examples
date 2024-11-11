# Encore + Sequelize TypeScript Example

This is a RESTful API Starter with [Sequelize TypeScript](https://sequelize.org/) as ORM to handle database CRUD operations.

## Developing locally

When you have [installed Encore](https://encore.dev/docs/install), you can create a new Encore application and clone this example with this command.

```bash
encore app create my-app-name --example=ts/sequelize
```

## Running locally

```bash
encore run
```

While `encore run` is running, open <http://localhost:9400/> to view Encore's [local developer dashboard](https://encore.dev/docs/observability/dev-dash).

## Using the API

Counts and returns the number of existing users

```bash
curl 'http://localhost:4000/count/users'
```

Create a new user

```bash
curl 'http://localhost:4000/users' -d '{"name":"John","surname":"Doe"}'
```

Get all users data

```bash
curl 'http://localhost:4000/users'

# for paginated data:
curl 'http://localhost:4000/users?page=1&limit=10'
```

Get user data by id

```bash
curl 'http://localhost:4000/users/:id'
```

Update user data

```bash
# partial update
curl -XPATCH 'http://localhost:4000/users/:id' -d '{"data":{"name":"Johnny"}}'

# update complete data
curl -XPATCH 'http://localhost:4000/users/:id' -d '{"data":{"name":"Mary","surname":"Jane"}}'
```

Delete an user by id

```bash
curl -X DELETE 'http://localhost:4000/users/:id'
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
