import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { autumn } from "../billing/autumn";

// ------------------------------------------------------------------
// Send Message
// ------------------------------------------------------------------

interface ChatRequest {
  message: string;
}

interface ChatResponse {
  reply: string;
}

// Sends a chat message and tracks usage against the customer's plan.
export const sendMessage = api(
  { expose: true, method: "POST", path: "/chat", auth: true },
  async (req: ChatRequest): Promise<ChatResponse> => {
    const auth = getAuthData()!;

    // Generate AI response (replace with your AI implementation)
    const reply = await generateAIResponse(req.message);

    // Track usage after successful response
    await autumn.track({
      customer_id: auth.userId,
      feature_id: "messages",
      value: 1,
    });

    return { reply };
  }
);

async function generateAIResponse(message: string): Promise<string> {
  // Replace this with your actual AI implementation
  // For example, using OpenAI, Anthropic, or another provider
  return `You said: ${message}`;
}

