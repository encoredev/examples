import { api } from "encore.dev/api";
import { langfuse } from "./clients";
import { db } from "./db";

interface AddFeedbackRequest {
  traceId: string;
  score: number; // 1-5
  comment?: string;
}

interface AddFeedbackResponse {
  success: boolean;
}

export const addFeedback = api(
  { expose: true, method: "POST", path: "/ai/feedback" },
  async (req: AddFeedbackRequest): Promise<AddFeedbackResponse> => {
    // Send to LangFuse
    await langfuse.score({
      traceId: req.traceId,
      name: "user-rating",
      value: req.score,
      comment: req.comment,
    });

    await langfuse.flushAsync();

    // Also store in database
    await db.exec`
      UPDATE chat_messages
      SET rating = ${req.score}
      WHERE langfuse_trace_id = ${req.traceId}
      AND role = 'assistant'
    `;

    return { success: true };
  }
);

