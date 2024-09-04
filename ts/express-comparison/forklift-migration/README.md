# Express.js forklift migration

This example showcases the use a forklift migration strategy by moving the entire Express.js application over to Encore.ts in one shot by wrapping your existing HTTP router in a catch-all handler.

More on this strategy can be found in the [Forklift migration (quick start)](https://encore.dev/docs/ts/how-to/express-migration#forklift-migration-quick-start) guide.

## Installing

### Prerequisite: Installing Encore

If this is the first time you're using Encore, you first need to install the CLI that runs the local development
environment. Use the appropriate command for your system:

- **macOS:** `brew install encoredev/tap/encore`
- **Linux:** `curl -L https://encore.dev/install.sh | bash`
- **Windows:** `iwr https://encore.dev/install.ps1 | iex`

When you have installed Encore, `cd` into this directory and run:

```bash
npm i
```

## Running locally

```bash
encore run
```

While `encore run` is running, open <http://localhost:9400/> to view Encore's [local developer dashboard](https://encore.dev/docs/observability/dev-dash).

## Testing

```bash
encore test
```
