# PostgreSQL Database Starter

This is a basic Hello World Encore application with a single API endpoint and a PostgreSQL database to keep track of how many times you've said hello.

## Developing locally

When you have [installed Encore](https://encore.dev/docs/install), you can create a new Encore application and clone this example with this command.

```bash
encore app create my-app-name --example=sql-database
```

## Using databases with Encore

In this starter app there is already a database defined, but let's take this opportunity to learn a bit about how Encore helps you create and use databases.

Encore treats SQL databases as logical resources and natively supports **PostgreSQL** databases.

To create a database, import `encore.dev/storage/sqldb` and call `sqldb.NewDatabase`, assigning the result to a package-level variable.
Databases must be created from within an [Encore service](https://encore.dev/docs/primitives/services-and-apis).

For example:

```
-- todo/db.go --
package todo

// Create the todo database and assign it to the "tododb" variable
var tododb = sqldb.NewDatabase("todo", sqldb.DatabaseConfig{
	Migrations: "./migrations",
})

// Then, query the database using db.QueryRow, db.Exec, etc.
-- todo/migrations/1_create_table.up.sql --
CREATE TABLE todo_item (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT false
  -- etc...
);
```

As seen above, the `sqldb.DatabaseConfig` specifies the directory containing the database migration files,
which is how you define the database schema.
See the [Defining the database schema](#defining-the-database-schema) section below for more details.

With this code in place Encore will automatically create the database when starting `encore run` (locally)
or on the next deployment (in the cloud). Encore automatically injects the appropriate configuration to authenticate
and connect to the database, so once the application starts up the database is ready to be used.

## Defining the database schema

Database schemas are defined by creating *migration files* in a directory named `migrations`
within an Encore service package. Each migration file is named `<number>_<name>.up.sql`, where
`<number>` is a sequence number for ordering the migrations and `<name>` is a
descriptive name of what the migration does.

On disk it might look like this:

```
/my-app
├── encore.app                       // ... and other top-level project files
│
└── todo                             // todo service (a Go package)
    ├── migrations                   // todo service db migrations (directory)
    │   ├── 1_create_table.up.sql    // todo service db migration
    │   └── 2_add_field.up.sql       // todo service db migration
    ├── todo.go                      // todo service code
    └── todo_test.go                 // tests for todo service
```

Each migration runs in order and expresses the change in the database schema
from the previous migration.

**The file name format is important.** Migration files must be sequentially named, starting with `1_` and counting up for each migration.
Each file name must also end with `.up.sql`.

The first migration usually defines the initial table structure. For example,
a `todo` service might start out by creating `todo/migrations/1_create_table.up.sql` with
the following contents:

```sql
CREATE TABLE todo_item (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    done BOOLEAN NOT NULL DEFAULT false
);
```

## Running locally

To run the application locally, make sure you have [Docker](https://docker.com) installed and running. This is required to run Encore applications with SQL databases.

```bash
encore run
```

## Using the API in the example

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
