# {{name}}

Signs up users and welcomes them by email, event-driven. A signup is stored in
the `{{ident}}` Postgres database and published as an event on the
`{{kebab}}-user-added` Pub/Sub topic. The `{{kebab}}-welcome-email` subscription,
in this same service, receives the event and sends the new user a welcome email
through [SendGrid](https://sendgrid.com). The request that signed the user up
does not wait for the email, and a failed send is retried.

Encore provisions the database, the topic and the subscription, and applies the
migrations in `./migrations`, when the app runs.

## Routes

| Method | Path                  | What it does                                            |
| ------ | --------------------- | ------------------------------------------------------- |
| `POST` | `/{{name}}/users`     | Sign up a user from `{"name": "...", "email": "..."}`   |
| `GET`  | `/{{name}}/users`     | List every user                                         |
| `GET`  | `/{{name}}/users/:id` | Get one user                                            |

With `encore run` running, call the service through the service proxy at
`localhost:4000/{{name}}`:

```sh
curl -X POST localhost:4000/{{name}}/users \
  -H 'Content-Type: application/json' \
  -d '{"name": "Ada", "email": "ada@example.com"}'

curl localhost:4000/{{name}}/users
curl localhost:4000/{{name}}/users/1
```

## Sending the email

Without a SendGrid API key the service runs as is: the subscription logs the
email it would have sent. To send it, set this service's `SendGridAPIKey`
secret; the command reads the value from stdin and stores it for this machine:

```sh
encore secret set --service {{name}} SendGridAPIKey
```

The service reads the key when it starts, so restart the app if it is running
(`encore stop`, then `encore run`). Then change `fromAddress` in `index.ts` to a
sender address your SendGrid account has verified.

A send that fails (SendGrid answering with an error, say for a wrong key) makes
the handler throw, and the message is delivered again after a backoff. `encore
pubsub ls` shows the messages waiting or retrying, and `encore pubsub discard`
drops them.
