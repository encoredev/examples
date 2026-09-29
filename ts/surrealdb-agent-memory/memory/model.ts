export const EMBEDDING_DIMENSIONS = 8;

export interface MemoryEvent {
  memoryID: string;
  agentID: string;
  text: string;
  embedding: number[];
  entities: Array<{ name: string; slug: string }>;
  expiresAt?: Date;
}

export interface RecalledMemory {
  id: string;
  text: string;
  distance: number;
  entities: string[];
  createdAt: string;
  expiresAt?: string;
}

export interface EntityMemory {
  id: string;
  text: string;
  createdAt: string;
}

export function validateEmbedding(embedding: number[]): void {
  if (
    embedding.length !== EMBEDDING_DIMENSIONS ||
    embedding.some((value) => !Number.isFinite(value))
  ) {
    throw new Error(
      `embedding must contain ${EMBEDDING_DIMENSIONS} finite numbers`,
    );
  }
}

export function normalizeEntities(entities: string[]): MemoryEvent["entities"] {
  const normalized = new Map<string, string>();
  for (const name of entities) {
    const cleanName = name.trim();
    const slug = cleanName
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    if (cleanName && slug) normalized.set(slug, cleanName);
  }
  return [...normalized].map(([slug, name]) => ({ slug, name }));
}
