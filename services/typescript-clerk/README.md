# {{name}}

User profiles behind [Clerk](https://clerk.com) authentication. Every protected route verifies
the caller's Clerk session token, and each user's preferences (theme, notifications, bio) are
kept in a Postgres database that Encore provisions. Clerk's webhooks create a profile when a
user signs up and delete it when the user is deleted.

## Routes

| Route | What it does |
| --- | --- |
| `GET /{{name}}/profile` | The signed-in user's profile and preferences, created with the defaults on first use. With `ClerkSecretKey` set it also has the user's email address and name, from Clerk's Backend API. |
| `POST /{{name}}/preferences` | Updates any of `{"theme": "light" \| "dark", "notifications": true, "bio": "..."}`; the fields left out keep their values. |
| `POST /{{name}}/webhooks/clerk` | Clerk's webhook endpoint. Handles `user.created` and `user.deleted`; a delivery without a valid signature gets `400`. |

The two profile routes need the Clerk session token as `Authorization: Bearer <token>`. Without
one, or with one that is invalid or expired, they answer `401`. In your frontend, get the token
with Clerk's `getToken()` (`useAuth().getToken()` in React).

```bash
curl localhost:4000/{{name}}/profile -H "Authorization: Bearer $TOKEN"

curl localhost:4000/{{name}}/preferences -H "Authorization: Bearer $TOKEN" \
  -d '{"theme": "dark", "bio": "Hello!"}'
```

Use the gateway address that `encore run` prints in place of `localhost:4000`.

## Secrets

| Secret | Value |
| --- | --- |
| `ClerkJwtKey` | Clerk Dashboard → **API keys** → **Show JWT public key** → **PEM Public Key**. With it, session tokens are verified locally, without calling Clerk. |
| `ClerkSecretKey` | Clerk Dashboard → **API keys** → **Secret keys** (`sk_...`). Used to look users up in Clerk's Backend API, and to verify session tokens against Clerk's published keys when `ClerkJwtKey` is not set. |
| `ClerkWebhookSecret` | The **Signing Secret** (`whsec_...`) of your webhook endpoint, under **Webhooks** in the Clerk Dashboard. |

Set at least one of `ClerkJwtKey` and `ClerkSecretKey`; until then the profile routes answer
`503`. The webhook answers `503` until `ClerkWebhookSecret` is set.

`encore secret set` reads the value from stdin and stores it for this machine:

```bash
encore secret set --service {{name}} ClerkJwtKey < clerk-jwt-public-key.pem
encore secret set --service {{name}} ClerkSecretKey
encore secret set --service {{name}} ClerkWebhookSecret
```

## Webhooks

In the Clerk Dashboard, add a webhook endpoint at `https://YOUR-API-URL/{{name}}/webhooks/clerk`
subscribed to `user.created` and `user.deleted`, and copy its signing secret into
`ClerkWebhookSecret`. Clerk can't reach `localhost`; deploy the app, or use a tunnel.

## Restricting which frontends may call it

A session token records the origin it was issued to. Add your frontends' origins to
`authorizedParties` in `index.ts` (for example `"http://localhost:3000"`, `"https://example.com"`)
to reject tokens issued to any other origin, as Clerk recommends.
