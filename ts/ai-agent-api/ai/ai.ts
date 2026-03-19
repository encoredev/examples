import { api, APIError } from "encore.dev/api";
import { secret } from "encore.dev/config";

const anthropicAPIKey = secret("AnthropicAPIKey");

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

// Internal API for generating AI completions using Claude.
export const complete = api(
  { expose: false, method: "POST", path: "/ai/complete" },
  async ({ messages }: CompleteRequest): Promise<CompleteResponse> => {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicAPIKey(),
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!resp.ok) {
      const body = await resp.text();
      throw APIError.internal(`AI request failed: ${resp.status} ${body}`);
    }

    const data = (await resp.json()) as {
      content: { type: string; text: string }[];
    };

    const text = data.content
      .filter((c) => c.type === "text")
      .map((c) => c.text)
      .join("");

    return { content: text };
  },
);
