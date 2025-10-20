# Encore.ts + Next.js + BetterAuth + Drizzle Starter

This is a starter template for building applications with [Encore.ts](https://encore.dev) and [Next.js](https://nextjs.org/) with authentication built-in.

It uses [BetterAuth](https://better-auth.com/) for authentication and [Drizzle ORM](https://orm.drizzle.team/) with PostgreSQL for the database.

### Features
- Email & password authentication
- User sign up, sign in, and sign out
- Protected dashboard page
- Session management
- Type-safe database with Drizzle ORM
- Automatic database migrations

### Tech stack
- **Backend:** [Encore.ts](https://encore.dev) - Type-safe backend with automatic infrastructure
- **Frontend:** [Next.js 15](https://nextjs.org/) - React framework with App Router
- **Auth:** [BetterAuth](https://better-auth.com/) - Full-featured authentication library
- **Database:** [Drizzle ORM](https://orm.drizzle.team/) + PostgreSQL
- **UI:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)

## Developing locally

### Prerequisites
- [Encore CLI](https://encore.dev/docs/install) installed
- Node.js 20 or later
- Docker (for local PostgreSQL)

When you have [installed Encore](https://encore.dev/docs/install), you can create a new Encore application and clone this example with this command:

```bash
encore app create my-app-name --example=ts/nextjs-betterauth-drizzle
```

## Running locally

Install backend dependencies:

```bash
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
cd ..
```

Run your Encore backend:

```bash
encore run
```

In a separate terminal, run the Next.js frontend:

```bash
npm run dev:frontend
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Local Development Dashboard

While `encore run` is running, open [http://localhost:9400](http://localhost:9400) to access Encore's local developer dashboard.

Here you can see:
- API docs and make requests in the API explorer
- View traces of responses
- Database explorer with Drizzle Studio integration (click **DB Explorer**)

## Database

The database is automatically provisioned by Encore. Migrations in `auth/migrations/` are automatically applied.

### Database Shell

Access the database via psql:

```bash
encore db shell auth
```

### Drizzle Studio

Open Drizzle Studio from the Encore dashboard at [http://localhost:9400](http://localhost:9400) by clicking **DB Explorer**.

Or run it standalone:

```bash
DATABASE_URL=$(encore db conn-uri auth) npm run db:studio
```

### Reset Database

To reset the database:

```bash
encore db reset
```

## Validation

The starter includes validation for:

- **Email format**: Standard email validation with regex
- **Email uniqueness**: Enforced by database unique constraint
- **Password length**: Minimum 8 characters, maximum 128 characters
- **Name length**: Minimum 2 characters
- **Password confirmation**: Must match on sign up

## Deployment

Deploy your application to a staging environment in Encore's free development cloud:

```bash
git push encore
```

Then head over to the [Cloud Dashboard](https://app.encore.dev) to monitor your deployment and find your production URL.

From there you can also connect your own AWS or GCP account to use for deployment.

### Frontend Deployment

Deploy the frontend to [Vercel](https://vercel.com):

```bash
cd frontend
vercel
```

Update `frontend/src/lib/auth-client.ts` with your production backend URL if needed, and update CORS origins in `encore.app`.

## Production Configuration

Before deploying to production:

1. **Change the auth secret** in `auth/better-auth.ts`:
   ```bash
   encore secret set --prod BETTER_AUTH_SECRET
   ```

2. **Update CORS origins** in `encore.app` to include your production domain

3. **(Optional) Enable email verification** in `auth/better-auth.ts`:
   ```typescript
   emailAndPassword: {
     enabled: true,
     requireEmailVerification: true,
   }
   ```

## Adding OAuth providers

To add OAuth providers (GitHub, Google, etc.), update `auth/better-auth.ts`:

```typescript
socialProviders: {
  github: {
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  },
}
```

Then add OAuth buttons to your sign-in page.

## Extending the database

To add new tables or fields:

1. Update `auth/schema.ts` with your changes
2. Generate migration: `npm run db:generate`
3. Restart the backend (migrations apply automatically)

Example - adding a posts table:

```typescript
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  userId: text("userId")
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").defaultNow(),
});
```

## Learn more

- [Encore Documentation](https://encore.dev/docs)
- [BetterAuth Documentation](https://better-auth.com)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Next.js Documentation](https://nextjs.org/docs)
