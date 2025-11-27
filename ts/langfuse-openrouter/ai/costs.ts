import { api } from "encore.dev/api";
import { db } from "./db";

interface CostSummaryResponse {
  totalCost: number;
  totalTokens: number;
  costsByModel: Record<string, { cost: number; tokens: number; messages: number }>;
}

export const getCostSummary = api(
  { expose: true, method: "GET", path: "/ai/costs" },
  async (): Promise<CostSummaryResponse> => {
    const rows = await db.query<{
      model: string;
      total_cost: number;
      total_tokens: number;
      message_count: number;
    }>`
      SELECT 
        model,
        SUM(cost_usd) as total_cost,
        SUM(tokens_used) as total_tokens,
        COUNT(*) as message_count
      FROM chat_messages
      WHERE role = 'assistant'
      GROUP BY model
    `;

    const costsByModel: Record<string, { cost: number; tokens: number; messages: number }> = {};
    let totalCost = 0;
    let totalTokens = 0;

    for await (const row of rows) {
      costsByModel[row.model] = {
        cost: Number(row.total_cost),
        tokens: row.total_tokens,
        messages: row.message_count,
      };
      totalCost += Number(row.total_cost);
      totalTokens += row.total_tokens;
    }

    return {
      totalCost,
      totalTokens,
      costsByModel,
    };
  }
);

