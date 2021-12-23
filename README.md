# Encore Examples

This repository contains several examples of how to build fully-functioning,
scalable, modern backend applications.

To run the examples, either clone this repository and run `encore run` in one 
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