# Service templates

Templates for `encore service new`, which adds one service to an existing Encore app.

Each directory here is one template, and its name is the template's id (lowercase letters,
digits and dashes). The directory holds the service exactly as it is written into the app,
plus a `meta.json` describing it:

```json
{
  "$schema": "../schema.json",
  "title": "Hello World",
  "description": "A minimal HTTP service with one route and no dependencies.",
  "lang": "go",
  "category": "demo",
  "tags": ["http"]
}
```

[`schema.json`](schema.json) describes every field. `description` matters most: it is what a
user's request (`encore service new` asks what the service should do) is matched against.
`category` is the section of the template picker it is listed in:

- `integration`: a third-party service, such as Stripe, Resend, Slack, Clerk or Sentry.
- `framework`: a web framework or library, such as FastAPI, Django, Axum, Fastify or Prisma.
  Set `framework` too.
- `demo`: shows what Encore itself does, such as Postgres, Pub/Sub, cron or object storage.

## Writing a template

- Put an `encore.service.json` at the top of the directory. Its `lang` must match `lang` in
  `meta.json`.
- Three placeholders are filled in, in every file's contents and path: `{{name}}` is the
  service's name, which is snake_case (`user_events`); `{{ident}}` is the same name as an
  identifier; `{{kebab}}` is it in kebab-case (`user-events`). Use `"name": "{{name}}"` in
  `encore.service.json`.
- Mount the API under `/{{name}}` rather than `/`, since the service is added next to
  others. The service receives the full path, prefix included.
- Derive every resource name from the service name, so the same template can be added to
  an app twice: `{{ident}}` for databases, which are snake_case, and `{{kebab}}` for the
  kebab-case names of topics, subscriptions, buckets and cron jobs.
- Depend on the Encore SDK as published (`sdk.encore.dev`, `@encore.dev/sdk`, `encore-dev`),
  with no lockfile, `go.sum` or local path overrides.
- Make it run without third-party accounts: read API keys from Encore secrets, and when one
  is unset (an empty string in TypeScript), skip the call with a log line or answer 503
  naming the secret. Never verify a signature with an empty key.
- Include a `README.md` for the user: the routes, with curl examples through the gateway,
  the secrets to set (`encore secret set --service <name> <Secret>`) and any setup step,
  such as `bun install`.
- Keep the files as text (UTF-8); binary files are skipped. A template's files are
  limited to 1 MiB in total.
- `meta.json` itself is not copied into the app.

Encore's platform reads this directory from the `main` branch and caches it for 10 minutes,
so a merged change shows up in the CLI within that time.
