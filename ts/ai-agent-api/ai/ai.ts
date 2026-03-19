import { api, APIError } from "encore.dev/api";
import { secret } from "encore.dev/config";
import Anthropic from "@anthropic-ai/sdk";

const anthropicAPIKey = secret("AnthropicAPIKey");

const client = () =>
  new Anthropic({ apiKey: anthropicAPIKey() });

export interface Message {
  role: "user" | "assistant";
  content: string;
}

interface CompleteRequest {
  messages: Message[];
}

interface CompleteResponse {
  content: string;
}

// Generate an AI completion using the Anthropic Claude API.
export const complete = api(
  { expose: false, method: "POST", path: "/ai/complete" },
  async ({ messages }: CompleteRequest): Promise<CompleteResponse> => {
    const response = await client().messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages,
    });

    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("");

    return { content: text };
  },
);
