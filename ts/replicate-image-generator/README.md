# AI Image Generator with Replicate

This example demonstrates how to build a production-ready AI image generation backend using [Replicate](https://replicate.com/) and Encore.

## Features

- **Image Generation API** - Generate images using FLUX and Stable Diffusion models
- **Async Prediction Handling** - Poll for prediction status and results
- **Image Storage** - Store generated images using Encore's object storage
- **Static Frontend** - Simple web UI to test the API
- **Type-safe** - Full TypeScript types throughout

## Build from scratch with a tutorial

If you prefer, check out the [full tutorial](https://encore.dev/blog/replicate-image-gen-tutorial) to learn how to build this application from scratch.

## Prerequisites

**Install Encore:**
- **macOS:** `brew install encoredev/tap/encore`
- **Linux:** `curl -L https://encore.dev/install.sh | bash`
- **Windows:** `iwr https://encore.dev/install.ps1 | iex`

**Docker:**
- Install [Docker](https://docker.com)
- Start Docker

**Replicate Account:**
- Sign up at [replicate.com](https://replicate.com) and get your API token

## Running locally

1. Install dependencies:
```bash
npm install
```

2. Set your Replicate API token:
```bash
encore secret set --dev ReplicateToken
```

3. Start the backend (make sure Docker is running):
```bash
encore run
```

4. Open the frontend at `http://localhost:4000`

5. Try generating an image by entering a prompt like:
   - "A serene Japanese garden with cherry blossoms and a koi pond"
   - "A cyberpunk street at night with neon signs, rain-slicked pavement, and flying cars"
   - "A cozy coffee shop interior with warm lighting, wooden tables, and vintage decor"

## API Endpoints

- `POST /ai/generate` - Start image generation
- `GET /ai/predictions/:id` - Check prediction status
- `POST /ai/save-image` - Save generated image to storage

## Project Structure

```
├── ai/                     # AI service
│   ├── encore.service.ts  # Service definition
│   ├── replicate.ts       # Replicate client setup
│   ├── generate.ts        # Image generation endpoints
│   └── storage.ts         # Object storage bucket
└── frontend/              # Static frontend
    ├── encore.service.ts  # Service definition
    ├── frontend.ts        # Static file server
    └── assets/
        └── index.html     # Web UI
```

## Local Development Dashboard

Open `http://localhost:9400` to access Encore's local development dashboard with:

- API Explorer with interactive documentation
- Service architecture diagram
- Distributed tracing for all requests
- Database explorer

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

Set your production secret:
```bash
encore secret set --prod ReplicateToken
```

You can also open your app in the [Cloud Dashboard](https://app.encore.cloud) to integrate with GitHub, or connect your AWS/GCP account, enabling Encore to automatically handle cloud deployments for you.

## Learn More

- [Full tutorial](https://encore.dev/blog/replicate-image-gen-tutorial) - Step-by-step guide
- [Encore Documentation](https://encore.dev/docs) - Learn about Encore features
- [Replicate Docs](https://replicate.com/docs) - Explore more AI models
