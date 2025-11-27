# LLM Observability with LangFuse and OpenRouter

This example demonstrates how to build a production-ready chat backend with full LLM observability using [LangFuse](https://langfuse.com/), [OpenRouter](https://openrouter.ai/), and Encore.

## Features

- **Multi-Model Chat API** - Access Claude, GPT, Gemini, Llama, and more through OpenRouter
- **Full Observability** - Every LLM call traced in LangFuse with prompts, tokens, costs, and latency
- **Chat History** - PostgreSQL database with session management and conversation persistence
- **User Feedback** - Rate responses (1-5 stars) and track quality metrics
- **Cost Tracking** - Monitor spending per model, user, and query
- **Static Frontend** - Clean chat UI with conversation history sidebar and rating persistence
- **Type-safe** - Full TypeScript types throughout

## Build from scratch with a tutorial

If you prefer, check out the [full tutorial](https://encore.dev/blog/langfuse-tutorial) to learn how to build this application from scratch.

## Prerequisites

**Install Encore:**
- **macOS:** `brew install encoredev/tap/encore`
- **Linux:** `curl -L https://encore.dev/install.sh | bash`
- **Windows:** `iwr https://encore.dev/install.ps1 | iex`

**Docker:**
- Install [Docker](https://docker.com)
- Start Docker

**LangFuse Account:**
- Sign up at [cloud.langfuse.com](https://cloud.langfuse.com) (or self-host)
- Create a project and get your API keys (public and secret)

**OpenRouter Account:**
- Sign up at [openrouter.ai](https://openrouter.ai)
- Create an API key
- (Optional) Add credits for production use

## Running locally

1. Install dependencies:
```bash
npm install
```

2. Set your API keys:
```bash
encore secret set --dev LangfuseSecretKey
encore secret set --dev LangfusePublicKey
encore secret set --dev OpenRouterKey
```

3. Start the backend (make sure Docker is running):
```bash
encore run
```

4. Open the frontend at `http://localhost:4000`

5. Try chatting with different models:
   - Claude 4.5 Opus (highest quality, premium cost)
   - GPT-5 (high quality, high cost)
   - Gemini 3 Pro (balanced)
   - Llama 3.3 70B (good quality, low cost)

6. View traces in LangFuse at [cloud.langfuse.com](https://cloud.langfuse.com)

## API Endpoints

- `POST /ai/chat` - Send a chat message and get AI response
- `GET /ai/chat/:sessionId` - Get chat history for a session
- `POST /ai/feedback` - Rate a response (1-5 stars)
- `GET /ai/costs` - Get cost summary by model

## Project Structure

```
├── ai/                     # AI service
│   ├── encore.service.ts  # Service definition
│   ├── clients.ts         # LangFuse & OpenRouter setup
│   ├── db.ts              # Database connection
│   ├── chat.ts            # Chat endpoints with observability
│   ├── feedback.ts        # User rating endpoint
│   ├── costs.ts           # Cost tracking endpoint
│   └── migrations/        # Database schema
└── frontend/              # Static frontend
    ├── encore.service.ts  # Service definition
    ├── static.ts          # Static file server
    ├── index.html         # Chat UI
    ├── styles.css         # Minimal Apple-like design
    └── app.js             # Session management & API calls
```

## Local Development Dashboard

Open `http://localhost:9400` to access Encore's local development dashboard with:

- API Explorer with interactive documentation
- Service architecture diagram
- Distributed tracing for all requests (including OpenRouter and LangFuse calls)
- Database explorer to browse chat history

## Using LangFuse

Once you have traces flowing into LangFuse, you can:

- **Track costs** - See total spend per model, identify high-volume users
- **Monitor latency** - Find slow queries and optimize prompts
- **Collect feedback** - User ratings show which responses work best
- **Compare models** - A/B test different models and see quality vs cost tradeoffs
- **Analyze tokens** - Identify queries using excessive tokens

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
encore secret set --prod LangfuseSecretKey
encore secret set --prod LangfusePublicKey
encore secret set --prod OpenRouterKey
```

You can also open your app in the [Cloud Dashboard](https://app.encore.cloud) to integrate with GitHub, or connect your AWS/GCP account, enabling Encore to automatically handle cloud deployments for you.

## Learn More

- [Full tutorial](https://encore.dev/blog/langfuse-tutorial) - Step-by-step guide
- [Encore Documentation](https://encore.dev/docs) - Learn about Encore features
- [LangFuse Docs](https://langfuse.com/docs) - LLM observability best practices
- [OpenRouter Docs](https://openrouter.ai/docs) - Explore more AI models
