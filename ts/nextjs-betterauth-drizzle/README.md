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

## Getting started

### Install Encore
If you haven't already, install Encore:

- **macOS:** `brew install encoredev/tap/encore`
- **Linux:** `curl -L https://encore.dev/install.sh | bash`
- **Windows:** `iwr https://encore.dev/install.ps1 | iex`

### Install dependencies

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

### Run locally

Start the Encore backend:

```bash
encore run
```

In a separate terminal, start the Next.js frontend:

```bash
npm run dev:frontend
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

### Database

The database is automatically provisioned by Encore when you run `encore run`. Migrations in `auth/migrations/` are automatically applied.

#### Database Shell

To access the database via psql:

```bash
encore db shell auth
```

#### Drizzle Studio

Drizzle Studio is integrated directly into the Encore local development dashboard at [http://localhost:9400](http://localhost:9400). 

Click on **DB Explorer** in the dashboard to browse tables, run queries, and edit data.

You can also run Drizzle Studio standalone:

```bash
DATABASE_URL=$(encore db conn-uri auth) npm run db:studio
```

#### Reset Database

To reset the database and re-run all migrations:

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

## Production deployment

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
     requireEmailVerification: true, // Change to true
   }
   ```

### Deploy backend to Encore

```bash
git add -A
git commit -m 'Initial commit'
git push encore
```

Your backend will be deployed to Encore's free development cloud. You can monitor it at [app.encore.dev](https://app.encore.dev).

### Deploy frontend to Vercel

```bash
cd frontend
vercel
```

Update `frontend/src/lib/auth-client.ts` with your production backend URL if needed.

## Project structure

```
.
├── auth/                          # Encore.ts backend service
│   ├── auth.ts                   # Authentication endpoints
│   ├── better-auth.ts            # Better Auth configuration
│   ├── db.ts                     # Database connection
│   ├── schema.ts                 # Drizzle database schema
│   ├── migrations/               # Database migrations
│   └── encore.service.ts         # Service definition
├── frontend/                      # Next.js frontend
│   ├── src/
│   │   ├── app/                  # App Router pages
│   │   │   ├── page.tsx         # Landing page
│   │   │   ├── sign-in/         # Sign in page
│   │   │   ├── sign-up/         # Sign up page
│   │   │   └── dashboard/       # Protected dashboard
│   │   ├── components/ui/       # shadcn/ui components
│   │   └── lib/
│   │       └── auth-client.ts   # Better Auth client setup
│   └── package.json
├── encore.app                     # Encore app configuration
└── package.json                  # Backend dependencies
```

## Adding OAuth providers

To add OAuth providers (GitHub, Google, etc.), update `auth/better-auth.ts`:

```typescript
socialProviders: {
  github: {
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  },
}
```

Then add OAuth buttons to your sign-in page using Better Auth's social sign-in methods.

## Extending the database

To add new tables or fields:

1. Update `auth/schema.ts` with your changes
2. Generate migration: `npm run db:generate`
3. Restart the backend (migrations apply automatically)

Example - adding a posts table:

```typescript
export const posts = pgTable("posts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  userId: text("userId")
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").defaultNow(),
});
```

### Using Drizzle Kit

The starter includes drizzle-kit for database management:

```bash
# Generate migrations after schema changes
npm run db:generate

# Open Drizzle Studio (visual database browser)
DATABASE_URL=$(encore db conn-uri auth) npm run db:studio

# Push schema changes directly without migrations (dev only)
DATABASE_URL=$(encore db conn-uri auth) npm run db:push
```

**Note:** The Encore backend must be running for drizzle-kit commands that connect to the database.

## Learn more

- [Encore Documentation](https://encore.dev/docs)
- [Better Auth Documentation](https://better-auth.com)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Next.js Documentation](https://nextjs.org/docs)

## License

MIT
