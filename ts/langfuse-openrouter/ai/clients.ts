import { Langfuse } from "langfuse";
import OpenAI from "openai";
import { secret } from "encore.dev/config";

const langfuseSecretKey = secret("LangfuseSecretKey");
const langfusePublicKey = secret("LangfusePublicKey");
const openrouterKey = secret("OpenRouterKey");

export const langfuse = new Langfuse({
  secretKey: langfuseSecretKey(),
  publicKey: langfusePublicKey(),
  baseUrl: "https://cloud.langfuse.com",
});

export const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: openrouterKey(),
});

