# pgvector + Encore Starter

Semantic search with [pgvector](https://github.com/pgvector/pgvector) and [Encore](https://encore.dev). Embeddings live alongside your relational data in Postgres &mdash; no separate vector database to operate.

[![Deploy to Encore](https://github.com/encoredev/examples/raw/main/assets/deploytoenc.svg)](https://app.encore.cloud/create-app/clone/ts-pgvector)

## What's included

- **Postgres + pgvector** with the extension enabled in a migration and an HNSW index for fast cosine search
- **OpenAI embeddings** via `text-embedding-3-small` (1536 dims), with the API key stored as an Encore secret
- **Add, search, and list endpoints** using type-safe SQL tagged templates
- **Frontend** at `/` with forms to add documents and run semantic search, plus a sample dataset

## Prerequisites

You'll need an [OpenAI](https://platform.openai.com) API key for the embedding calls.

## Get started

1. Install Encore if you haven't already:
   ```bash
   curl -L https://encore.dev/install.sh | bash
   ```

2. Create a new app from this example:
   ```bash
   encore app create --example=ts/pgvector
   ```

3. Set your OpenAI API key:
   ```bash
   encore secret set --type local OpenAIAPIKey
   ```

4. Run the app:
   ```bash
   encore run
   ```

5. Open http://localhost:4000, click *load some sample documents*, then try queries like `cellular energy production` or `database for caching`.

## How it works

The `documents` service stores each document's content along with its embedding in a `vector(1536)` column:

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE documents (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  embedding vector(1536) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX documents_embedding_idx
  ON documents USING hnsw (embedding vector_cosine_ops);
```

Search ranks documents by cosine distance using pgvector's `<=>` operator and converts it to a similarity score:

```ts
const rows = db.query`
  SELECT id, content, 1 - (embedding <=> ${literal}::vector) AS similarity
  FROM documents
  ORDER BY embedding <=> ${literal}::vector
  LIMIT ${limit}
`;
```

## Why pgvector instead of a dedicated vector database?

For most applications, pgvector is enough. You get one database to operate, transactional writes that keep documents and embeddings consistent, and the ability to filter and join against your existing relational data in the same query. Dedicated vector databases earn their keep at very large scale or when you need specialized index types &mdash; for everything below that, pgvector keeps the stack simple.

## Learn more

- [You probably don't need a vector database](https://encore.dev/blog/you-probably-dont-need-a-vector-database)
- [pgvector documentation](https://github.com/pgvector/pgvector)
- [OpenAI embeddings guide](https://platform.openai.com/docs/guides/embeddings)
- [Encore secrets docs](https://encore.dev/docs/ts/primitives/secrets)
- [Encore SQL databases](https://encore.dev/docs/ts/primitives/databases)
