<p align="center" dir="auto">
<a href="https://encore.dev"><img src="https://user-images.githubusercontent.com/78424526/214602214-52e0483a-b5fc-4d4c-b03e-0b7b23e012df.svg" width="160px" alt="encore icon"></img></a><br/><br/>
<b>Encore Templates</b><br/>
Templates to help you build backend applications with <a href="https://github.com/encoredev/encore">Encore</a>.
</p>

## Template types

This repo contains two types of templates:

- **Starters:** Runnable Encore applications for others to use as is, or take inspiration from.
- **Bits:** Re-usable code samples to solve common development patterns or integrate Encore applications with
  third-party APIs and services.

### Prerequisite: Installing Encore

If this is the first time you're using Encore, you first need to install the CLI that runs the local development
environment. Use the appropriate command for your system:

- **macOS:** `brew install encoredev/tap/encore`
- **Linux:** `curl -L https://encore.dev/install.sh | bash`
- **Windows:** `iwr https://encore.dev/install.ps1 | iex`

## Starters

| Name                                       | Description                                                      | Primitives                                       | Requirements                                                            |
|--------------------------------------------|------------------------------------------------------------------|--------------------------------------------------|-------------------------------------------------------------------------|
| [hello-world](hello-world)                 | REST API Starter                                                 | APIs                                             | -                                                                       |
| [sql-database](sql-database)               | PostgreSQL database Starter                                      | APIs, SQL Database                               | [Docker](https://docker.com/)                                           |
| [slack-bot](slack-bot)                     | Slack Bot Starter                                                | APIs                                             | Slack Workspace                                                         |
| [trello-clone](trello-clone)               | Microservices Starter (Trello Clone)                             | Microservices, APIs, SQL Database                | [Docker](https://docker.com/)                                           |
| [uptime](uptime)                           | Event-Driven Architecture Starter (Uptime Monitor)               | Microservices, SQL Databases, Pub/Sub, Cron Jobs | [Docker](https://docker.com/)                                           |
| [graphql](graphql)                         | GraphQL Server Starter                                           | APIs, SQL Database, GraphQL                      | [Docker](https://docker.com/)                                           |
| [url-shortener](url-shortener)             | Basic url shortener                                              | APIs, SQL Database                               | [Docker](https://docker.com/)                                           |
| [sqlc-database](sqlc-database)             | Simple sqlc implementation                                       | APIs, SQL Database                               | [sqlc](https://docs.sqlc.dev/en/stable/), [Docker](https://docker.com/) |
| [next-starter](nextjs-starter)             | Next.js + Encore Web App Starter                                 | APIs, Auth, Frontend                             | [Node.js](https://nodejs.org/en)                                        |
| [next-auth0-starter](nextjs-auth0-starter) | Next.js + Auth0 + Encore Web App Starter                         | APIs, Auth, Frontend                             | [Node.js](https://nodejs.org/en)                                        |
| [react-starter](react-starter)             | React + Encore Web App Starter                                   | APIs, Auth, Frontend                             | [Node.js](https://nodejs.org/en)                                        |
| [booking-system](booking-system)           | Appointment Booking System Starter using data scrubbing and sqlc | APIs, Auth, SQL Database, Frontend               | [Docker](https://docker.com/)                                           |

### Running Starters

Each sub-folder in this repo contains a runnable **Starter** application.

Use `encore app create [app-name] --example=[folder-name]` to
create your own app based on the example.

For example, to create an app based on `sql-database`:

```bash
$ encore app create my-app --example=sql-database
Successfully created app my-app.
$ cd my-app
$ encore run
Running on http://localhost:4000
8:00AM INF registered endpoint endpoint=There service=hello
```

## Bits

The [bits](bits) sub-folder contains reusable code samples that can be copied directly into your own application.

| Name                          | Description                                                                          | Primitives             | Requirements                                                                              |
|-------------------------------|--------------------------------------------------------------------------------------|------------------------|-------------------------------------------------------------------------------------------|
| [elevenlabs](bits/elevenlabs) | Getting text to speech from [ElevenLabs](https://elevenlabs.io/) generative voice AI | APIs, Secrets          | [ElevenLabs API key](https://docs.elevenlabs.io/api-reference/quick-start/authentication) |
| [pexels](bits/pexels)         | Searching and retrieving photos and videos from [Pexels](https://www.pexels.com/)    | APIs, Secrets          | [Pexels API key](https://www.pexels.com/api/)                                             |
| [sendgrid](bits/sendgrid)     | Asynchronous sending emails via [SendGrid](https://sendgrid.com/)                    | APIs, Secrets, Pub/Sub | [SendGrid API key](https://docs.sendgrid.com/ui/account-and-settings/api-keys)            |

## Contribute your templates

Contribute a template by submitting a Pull Request to
the [Open Source Examples Repo](https://github.com/encoredev/examples): `https://github.com/encoredev/examples`

### Submitting Starters

Follow these steps to submit a **Starter**:

1. Fork the repo.
2. Create a new folder in the root directory of the repo, this is where you will place your template. Use a short folder
   name as your template will be installable via the CLI, like
   so: `encore app create APP-NAME --example=<TEMPLATE_FOLDER_NAME>`
3. Include a `README.md` with instructions for how to use the template. We recommend
   following [this format](https://github.com/encoredev/examples/blob/8c7e33243f6bfb1b2654839e996e9a924dcd309e/uptime/README.md).

Once your Pull Request has been approved, it may be featured on the [Templates page](/templates) on the Encore website.

### Submitting Bits

Follow these steps to submit your **Bits**:

1. Fork the repo.
2. Create a new folder inside the `bits` folder in the repo and place your template inside it. Use a short folder name
   as your template will soon be installable via the CLI.
3. Include a `README.md` with instructions for how to use the template.

Once your Pull Request has been approved, it may be featured on the [Templates page](/templates) on the Encore website.

### Dynamic Encore AppID

In most cases, you should avoid hardcoding an `AppID` in your template's source code. Instead, use the
notation `{{ENCORE_APP_ID}}`.

When a developer creates an app using the template, `{{ENCORE_APP_ID}}` will be dymically replaced with their new and
unique `AppID`, meaning they will not need to make any manual code adjustments.
