# SurrealDB + Encore agent memory

This example builds a durable memory service for AI agents with [SurrealDB](https://surrealdb.com/) and [Encore](https://encore.dev/). Memories enter through a typed API, are written asynchronously through Encore Pub/Sub, and can be recalled from SurrealDB by vector similarity or by following graph relationships between memories and entities. A scheduled job removes expired memories.

The embedding and entity names are supplied by the caller, keeping the backend independent of any particular model provider.

## Run it locally

Install the [Encore CLI](https://encore.dev/docs/install) and start SurrealDB 3.3:

```bash
docker run --rm --name encore-surrealdb-memory \
  -p 8000:8000 \
  surrealdb/surrealdb:v3.3.0 \
  start --user root --pass secret memory
```

Create the example app in another terminal and start it:

```bash
encore app create agent-memory --example=ts/surrealdb-agent-memory
cd agent-memory
npm install
encore run
```

Local development connects to `http://127.0.0.1:8000` with the credentials from the Docker command. Encore starts the API, Pub/Sub topic, subscription, and cron infrastructure used by the application.

## Store and recall a memory

The example uses eight-dimensional vectors so its requests remain readable. A production embedding model will usually return larger vectors; update `EMBEDDING_DIMENSIONS` and the `DIMENSION` in the HNSW index together before using one.

Store two memories that refer to a shared entity:

```bash
curl -X POST http://localhost:4000/agents/research-agent/memories \
  -H 'Content-Type: application/json' \
  -d '{
    "text": "Encore deploys the agent backend into the team AWS account.",
    "embedding": [0.98, 0.02, 0, 0, 0, 0, 0, 0],
    "entities": ["Encore", "AWS"]
  }'

curl -X POST http://localhost:4000/agents/research-agent/memories \
  -H 'Content-Type: application/json' \
  -d '{
    "text": "SurrealDB stores vector and graph context for the agent.",
    "embedding": [0.94, 0.06, 0, 0, 0, 0, 0, 0],
    "entities": ["SurrealDB", "Encore"]
  }'
```

Both endpoints return as soon as the memory has been published. The Pub/Sub subscriber writes it to SurrealDB asynchronously, so allow a moment before recalling newly queued memories.

Recall the nearest memories by meaning:

```bash
curl -X POST http://localhost:4000/agents/research-agent/recall \
  -H 'Content-Type: application/json' \
  -d '{
    "embedding": [0.95, 0.05, 0, 0, 0, 0, 0, 0],
    "limit": 5
  }'
```

Or follow the graph relationship to retrieve every memory that mentions Encore:

```bash
curl http://localhost:4000/agents/research-agent/entities/encore/memories
```

The subscriber is configured for at-least-once delivery. Its SurrealQL transaction uses stable record and relationship IDs, making a retried event safe to process again.

## Test the scheduled cleanup

Cron jobs do not fire automatically in local or preview environments, so call the endpoint directly to test the same handler used by the deployed schedule:

```bash
curl -X POST http://localhost:4000/memories/prune
```

## Connect a hosted SurrealDB database

Configure the connection as Encore secrets before deploying:

```bash
encore secret set --type dev,prod SurrealDBURL
encore secret set --type dev,prod SurrealDBToken
```

`SurrealDBURL` is the database endpoint used by the SurrealDB SDK, and `SurrealDBToken` is a database token with access to create and use the `encore` namespace and `agent_memory` database. For Surreal Cloud, retrieve both with `surrealctl instance endpoint` and `surrealctl instance token`; a personal access token beginning with `sdbp_` authenticates the Cloud control plane and is not a runtime database token.

Encore provisions the application infrastructure in your AWS or GCP account. SurrealDB remains the system of record for agent memory and can run in Surreal Cloud or another environment reachable by the deployed backend.

## Run the tests

Unit tests run without a database:

```bash
encore test
```

Set `SURREAL_TEST_URL` to include the integration suite against a running SurrealDB instance:

```bash
SURREAL_TEST_URL=http://127.0.0.1:8000 encore test
```
