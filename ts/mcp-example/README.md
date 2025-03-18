# Weather MCP Demo with Encore

This is a simple Model Context Protocol (MCP) demo focused on weather functionality using Encore. The code is extremely typed, well-documented with JSDocs, follows SOLID principles, and incorporates Test-Driven Development (TDD).

## Features

- Weather service that provides current weather information for cities
- MCP server implementation using the Model Context Protocol SDK
- Type-safe API with Zod schema validation
- Comprehensive test suite using Vitest

## Developing locally

When you have [installed Encore](https://encore.dev/docs/ts/install), you can run this application locally.

## Running locally
```bash
encore run
```

While `encore run` is running, open <http://localhost:9400/> to view Encore's [local developer dashboard](https://encore.dev/docs/ts/observability/dev-dash).

## Testing

### Running the test suite
```bash
encore test
```

### Testing the MCP functionality
```bash
# Run the MCP client test script
./scripts/run-mcp-test.sh
```

## MCP Tools

This demo implements the following MCP tools:

- `get-weather`: Get the current weather for a specified city

## Deployment

Deploy your application to a staging environment in Encore's free development cloud:

```bash
git add -A .
git commit -m 'Commit message'
git push encore
```

Then head over to the [Cloud Dashboard](https://app.encore.dev) to monitor your deployment and find your production URL.

From there you can also connect your own AWS or GCP account to use for deployment.

## Resources

- [Encore Documentation](https://encore.dev/docs/ts)
- [Model Context Protocol SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Vitest Documentation](https://vitest.dev/)

author: @leofmarciano 
