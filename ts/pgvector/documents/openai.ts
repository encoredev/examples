import OpenAI from "openai";
import { secret } from "encore.dev/config";

// Store your OpenAI API key as an Encore secret:
//   encore secret set --type dev,local,pr,production OpenAIAPIKey
const apiKey = secret("OpenAIAPIKey");

const client = new OpenAI({ apiKey: apiKey() });

const EMBEDDING_MODEL = "text-embedding-3-small";

// embed returns a 1536-dim embedding for the given text.
export async function embed(text: string): Promise<number[]> {
  const res = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  });
  return res.data[0].embedding;
}
