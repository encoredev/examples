import { api } from "encore.dev/api";
import { langfuse, openrouter } from "./clients";
import { db } from "./db";
import log from "encore.dev/log";

interface ChatRequest {
  message: string;
  model?: string;
  userId?: string;
  sessionId?: string;
}

interface ChatResponse {
  messageId: string;
  response: string;
  model: string;
  traceId: string;
  tokensUsed: number;
  latencyMs: number;
  costUsd: number;
}

export const chat = api(
  { expose: true, method: "POST", path: "/ai/chat" },
  async (req: ChatRequest): Promise<ChatResponse> => {
    const startTime = Date.now();
    const model = req.model || "anthropic/claude-4.5-opus";
    const sessionId = req.sessionId || `session-${Date.now()}`;

    const messages = [
      {
        role: "user" as const,
        content: req.message,
      },
    ];

    // Create a LangFuse trace for this chat completion
    const trace = langfuse.trace({
      name: "chat-completion",
      userId: req.userId,
      sessionId,
      input: messages,
      metadata: {
        model,
      },
      tags: ["chat", model.split("/")[0]],
    });

    try {
      // Create a generation span within the trace
      const generation = trace.generation({
        name: "openrouter-completion",
        model,
        modelParameters: {
          max_tokens: 1000,
        },
        input: messages,
      });

      log.info("Starting chat completion", { traceId: trace.id, model });

      // Call OpenRouter for completion
      const completion = await openrouter.chat.completions.create({
        model,
        messages,
        max_tokens: 1000,
      });

      const response = completion.choices[0]?.message?.content || "";
      const tokensUsed = completion.usage?.total_tokens || 0;
      const latency = Date.now() - startTime;

      // Estimate cost (rates vary by model)
      const costPer1kTokens = model.includes("claude-4.5-opus") ? 0.015 : 0.002;
      const cost = (tokensUsed / 1000) * costPer1kTokens;

      // Update the generation span with output and metadata
      generation.end({
        output: response,
        usage: {
          totalTokens: tokensUsed,
          input: completion.usage?.prompt_tokens || 0,
          output: completion.usage?.completion_tokens || 0,
        },
        metadata: {
          latencyMs: latency,
          costUsd: cost,
        },
      });

      // Store user message
      const userMessageId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      await db.exec`
        INSERT INTO chat_messages (
          id, user_id, session_id, role, content, model,
          langfuse_trace_id, tokens_used, cost_usd, latency_ms
        )
        VALUES (
          ${userMessageId}, ${req.userId}, ${sessionId}, 'user', ${req.message}, ${model},
          ${trace.id}, 0, 0, 0
        )
      `;

      // Store assistant response
      const assistantMessageId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      await db.exec`
        INSERT INTO chat_messages (
          id, user_id, session_id, role, content, model,
          langfuse_trace_id, tokens_used, cost_usd, latency_ms
        )
        VALUES (
          ${assistantMessageId}, ${req.userId}, ${sessionId}, 'assistant', ${response}, ${model},
          ${trace.id}, ${tokensUsed}, ${cost}, ${latency}
        )
      `;

      log.info("Chat completion successful", {
        messageId: assistantMessageId,
        traceId: trace.id,
        tokensUsed,
        latencyMs: latency,
      });

      // Update trace with output
      trace.update({
        output: response,
      });

      // Finalize the trace
      await langfuse.flushAsync();

      return {
        messageId: assistantMessageId,
        response,
        model,
        traceId: trace.id,
        tokensUsed,
        latencyMs: latency,
        costUsd: cost,
      };
    } catch (error) {
      // Track errors in LangFuse
      trace.event({
        name: "completion-error",
        metadata: {
          error: error instanceof Error ? error.message : "Unknown error",
        },
      });

      await langfuse.flushAsync();
      throw error;
    }
  }
);

interface ChatMessage {
  id: string;
  role: string;
  content: string;
  model: string;
  tokensUsed: number;
  costUsd: number;
  createdAt: Date;
  traceId: string | null;
  rating: number | null;
}

interface ChatHistoryRequest {
  sessionId: string;
}

interface ChatHistoryResponse {
  messages: ChatMessage[];
  totalTokens: number;
  totalCost: number;
}

export const getChatHistory = api(
  { expose: true, method: "GET", path: "/ai/chat/:sessionId" },
  async ({ sessionId }: ChatHistoryRequest): Promise<ChatHistoryResponse> => {
    const rows = await db.query<{
      id: string;
      role: string;
      content: string;
      model: string;
      tokens_used: number;
      cost_usd: number;
      created_at: Date;
      langfuse_trace_id: string | null;
      rating: number | null;
    }>`
      SELECT id, role, content, model, tokens_used, cost_usd, created_at, langfuse_trace_id, rating
      FROM chat_messages
      WHERE session_id = ${sessionId}
      ORDER BY created_at ASC
    `;

    const messages: ChatMessage[] = [];
    let totalTokens = 0;
    let totalCost = 0;

    for await (const row of rows) {
      messages.push({
        id: row.id,
        role: row.role,
        content: row.content,
        model: row.model,
        tokensUsed: row.tokens_used,
        costUsd: row.cost_usd,
        createdAt: row.created_at,
        traceId: row.langfuse_trace_id,
        rating: row.rating,
      });
      totalTokens += row.tokens_used;
      totalCost += Number(row.cost_usd);
    }

    return { messages, totalTokens, totalCost };
  }
);

