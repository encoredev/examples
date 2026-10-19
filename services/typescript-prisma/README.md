# {{name}}

A REST API for users, stored in Postgres through [Prisma](https://www.prisma.io). Encore
provisions the database and applies its migrations; Prisma gives the code a typed client for
it, connected with the connection string Encore hands the database.

## Routes

Every response is JSON like `{"success": true, "result": ...}`, or
`{"success": false, "message": "..."}` with a `4xx` status.

| Route | What it does |
| --- | --- |
| `GET /{{name}}/count/users` | Counts the users. |
| `POST /{{name}}/users` | Creates a user from `{"name": "...", "surname": "..."}` and answers `201`. |
| `GET /{{name}}/users` | Lists every user. With `?page=1&limit=10`, one page and a `pagination` object. |
| `GET /{{name}}/users/{id}` | Gets a user, or `404`. |
| `PATCH /{{name}}/users/{id}` | Updates `{"name": "...", "surname": "..."}`, either field optional. |
| `DELETE /{{name}}/users/{id}` | Deletes a user. |

## Try it locally

Install the packages once (`bun install`, which also runs `prisma generate`), then with
`encore run` running, use the gateway's address that it prints in place of `localhost:4000`:

```bash
curl -s localhost:4000/{{name}}/users -d '{"name": "John", "surname": "Doe"}'
# {"success":true,"result":{"id":1,"name":"John","surname":"Doe"}}

curl -s localhost:4000/{{name}}/users
curl -s 'localhost:4000/{{name}}/users?page=1&limit=10'
curl -s localhost:4000/{{name}}/users/1
curl -s -X PATCH localhost:4000/{{name}}/users/1 -d '{"name": "Johnny"}'
curl -s -X DELETE localhost:4000/{{name}}/users/1
curl -s localhost:4000/{{name}}/count/users
```

## The Prisma client

`prisma/schema.prisma` holds the models. `prisma generate` writes the client for them to
`generated/prisma/` (gitignored). The `start` script runs it before the service starts, so a
schema change is picked up on the next start; `bun run generate` runs it on its own, for your
editor.

## Migrations

The database is named `{{ident}}` and declared in `db.ts`. Encore applies the numbered files in
`migrations/` when it starts the database, and records how far it got in `schema_migrations`.
Prisma writes the SQL; Encore runs it. To change the schema:

1. Edit `prisma/schema.prisma`, for example adding `email String?` to `User`.
2. With `encore run` running, let Prisma compare the schema with the database and write the
   difference as the next migration:

   ```bash
   DATABASE_URL="$(encore db conn-uri --database {{ident}})" \
     bunx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma \
     --script -o migrations/2_add_email.up.sql
   ```

3. Apply it to the running database with `encore db migrate --database {{ident}} --up`
   (a database Encore starts afresh applies it by itself), and restart the service, which
   regenerates the client.

`prisma.config.ts` marks `schema_migrations` as an external table, so the diff leaves Encore's
bookkeeping alone. Don't use `prisma migrate dev` or `prisma db push`: they would apply changes
behind Encore's back. `DATABASE_URL="$(encore db conn-uri --database {{ident}})" bunx prisma studio`
browses the data.
