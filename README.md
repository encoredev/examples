<p align="center" dir="auto">
<a href="https://encore.dev"><img src="https://user-images.githubusercontent.com/78424526/214602214-52e0483a-b5fc-4d4c-b03e-0b7b23e012df.svg" width="160px" alt="encore icon"></img></a><br/><br/>
<b>Encore examples</b><br/>
Examples to help you build fully-functioning, scalable, backend applications using <a href="https://github.com/encoredev/encore">Encore</a>.
</p>

## Example applications

| Example | Description | Primitives | Requirements |
| --- | --- | --- | --- |
| [hello-world](hello-world) | Simple REST API | APIs | - |
| [url-shortener](url-shortener) | Basic url shortener | APIs, SQL Database | [Docker](https://docker.com/) |
| [trello-clone](trello-clone) | Backend for a Trello application | Microservices, APIs, SQL Database | [Docker](https://docker.com/) |
| [graphql](graphql) | Url shortener that uses GraphQL | APIs, SQL Database, GraphQL | [Docker](https://docker.com/) |
| [sqlc-database](sqlc-database) | Simple sqlc implementation | APIs, SQL Database | [sqlc](https://docs.sqlc.dev/en/stable/), [Docker](https://docker.com/) |

## Installing Encore

If this is the first time you're using Encore, you first need to install the CLI that runs the local development environment.
Follow the [installation instructions](https://encore.dev/docs/install) in the documentation, or get started with the [Quick Start Guide](https://encore.dev/docs/quick-start).

## Running examples

Each sub-folder in this repo contains an example application that you can use to try out Encore.

To run the example applications, either clone this repository and run `encore run` in one 
of the subdirectories, or use `encore app create [app-name] --example=[example-name]` to
create your own app based on the example.

For example, to create an app based on the `sql-database` example:

```bash
$ encore app create my-app --example=sql-database
Successfully created app my-app.
$ cd my-app
$ encore run
Running on http://localhost:4000
8:00AM INF registered endpoint endpoint=There service=hello
```

## Build from scratch with tutorials

If you prefer to build one of the examples from scratch, check out the [tutorials](https://encore.dev/docs/tutorials) available in the Encore documentation.
