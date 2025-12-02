# Secure AI Code Execution with Daytona

This example demonstrates how to build AI agent infrastructure that safely executes AI-generated code using [Daytona](https://www.daytona.io/) sandboxes and Encore.

## Features

- **Code Playground UI** - Interactive web interface for writing and running code
- **Secure Code Execution** - Run AI-generated Python, TypeScript, or JavaScript in isolated sandboxes
- **Full AI Agent Loop** - Prompt → Claude generates code → Daytona executes → results with auto-retry
- **Execution History** - PostgreSQL database stores all executions for debugging
- **File Operations** - Let AI-generated scripts read and write files within sandboxes
- **Timeout Protection** - Prevent runaway AI-generated code
- **Multi-Language Support** - Execute Python, TypeScript, and JavaScript

## Build from scratch with a tutorial

If you prefer, check out the [full tutorial](https://encore.dev/blog/daytona-tutorial) to learn how to build this application from scratch.

## Prerequisites

**Install Encore:**
- **macOS:** `brew install encoredev/tap/encore`
- **Linux:** `curl -L https://encore.dev/install.sh | bash`
- **Windows:** `iwr https://encore.dev/install.ps1 | iex`

**Docker:**
- Install [Docker](https://docker.com)
- Start Docker

**Daytona Account:**
- Sign up at [daytona.io](https://www.daytona.io/)
- Create an API key in the dashboard

**Anthropic Account (for AI code generation):**
- Sign up at [console.anthropic.com](https://console.anthropic.com/)
- Create an API key

## Running locally

1. Install dependencies:
```bash
npm install
```

2. Set your API keys:
```bash
encore secret set --dev DaytonaApiKey
encore secret set --dev AnthropicApiKey
```

3. Start the backend (make sure Docker is running):
```bash
encore run
```

4. Open the playground at `http://localhost:4000`

5. Or test the API directly:
```bash
# Execute Python code
curl -X POST http://localhost:4000/execute \
  -H "Content-Type: application/json" \
  -d '{
    "code": "print(\"Hello from Daytona!\")",
    "language": "python",
    "userId": "test-user"
  }'

# Full AI loop: prompt → generate → execute
curl -X POST http://localhost:4000/ai/generate-and-run \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Write Python code that prints the first 10 prime numbers",
    "language": "python"
  }'
```

## API Endpoints

- `POST /execute` - Execute code in a sandbox
- `GET /execute/history/:userId` - Get execution history for a user
- `POST /execute/files` - Execute code with file operations
- `POST /execute/timeout` - Execute with timeout protection
- `POST /ai/generate-and-run` - Full AI loop: prompt → Claude → Daytona → results

## Project Structure

```
├── execution/                  # Execution service
│   ├── encore.service.ts      # Service definition
│   ├── daytona.ts             # Daytona SDK setup
│   ├── db.ts                  # Database connection
│   ├── execute.ts             # Code execution endpoints
│   ├── files.ts               # File operations
│   ├── advanced.ts            # Timeout and advanced features
│   ├── ai-generate.ts         # AI code generation endpoint
│   └── migrations/            # Database schema
├── frontend/                   # Playground UI
│   ├── encore.service.ts      # Service definition
│   ├── static.ts              # Static file server
│   ├── index.html             # Playground UI
│   ├── styles.css             # Dark theme styling
│   └── app.js                 # Frontend logic
├── encore.app                 # App configuration
├── package.json               # Dependencies
└── tsconfig.json              # TypeScript config
```

## Local Development Dashboard

Open `http://localhost:9400` to access Encore's local development dashboard with:

- API Explorer with interactive documentation
- Service architecture diagram
- Distributed tracing for all requests (including Daytona sandbox calls)
- Database explorer to browse execution history

## Using Daytona

Daytona provides secure sandboxed environments for code execution. Key features:

- **Isolated Execution** - Each sandbox is completely isolated from your infrastructure
- **Multi-Language** - Python, TypeScript, JavaScript, and more
- **File System** - Read and write files within the sandbox
- **Git Operations** - Clone repositories into sandboxes
- **LangChain Integration** - [Official support](https://www.daytona.io/docs/integrations/langchain) for AI pipelines

## Deployment

### Self-hosting

See the [self-hosting instructions](https://encore.dev/docs/how-to/self-host) for how to use `encore build docker` to create a Docker image and configure it.

### Encore Cloud Platform

Deploy your application to a free staging environment in Encore's development cloud using `git push encore`:

```bash
git add -A .
git commit -m 'Commit message'
git push encore
```

Set your production secrets:
```bash
encore secret set --prod DaytonaApiKey
encore secret set --prod AnthropicApiKey
```

You can also open your app in the [Cloud Dashboard](https://app.encore.cloud) to integrate with GitHub, or connect your AWS/GCP account, enabling Encore to automatically handle cloud deployments for you.

## Learn More

- [Full tutorial](https://encore.dev/blog/daytona-tutorial) - Step-by-step guide
- [Encore Documentation](https://encore.dev/docs) - Learn about Encore features
- [Daytona Docs](https://www.daytona.io/docs) - Sandbox features and SDK reference
- [LangChain Integration](https://www.daytona.io/docs/integrations/langchain) - Use Daytona in AI pipelines

