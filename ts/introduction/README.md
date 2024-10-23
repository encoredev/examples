# Encore.ts Introduction

Follow the interactive lessons in the local development dashboard to help you get started with Encore.ts.

## Run the introduction

### Prerequisite: Installing Encore

If this is the first time you're using Encore, you first need to install the CLI that runs the local development
environment. Use the appropriate command for your system:

- **macOS:** `brew install encoredev/tap/encore`
- **Linux:** `curl -L https://encore.dev/install.sh | bash`
- **Windows:** `iwr https://encore.dev/install.ps1 | iex`

When you have installed Encore, run:

```bash
encore app create --example=ts/introduction
```

## Running locally
```bash
encore run
```

While `encore run` is running, open <http://localhost:9400/> to view Encore's [local developer dashboard](https://encore.dev/docs/observability/dev-dash) which for this app also includes an Introduction section. Complete lessons by writing code in your editor to extend the app and finish tasks that will help you master Encore.ts.
