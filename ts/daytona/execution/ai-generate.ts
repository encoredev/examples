import { api } from "encore.dev/api";
import { daytona } from "./daytona";
import { secret } from "encore.dev/config";

const anthropicKey = secret("AnthropicApiKey");

interface GenerateAndRunRequest {
  prompt: string;
  language: "python" | "typescript";
  maxRetries?: number;
}

interface GenerateAndRunResponse {
  code: string;
  output: string;
  success: boolean;
  attempts: number;
}

export const generateAndRun = api(
  { expose: true, method: "POST", path: "/ai/generate-and-run" },
  async (req: GenerateAndRunRequest): Promise<GenerateAndRunResponse> => {
    const maxRetries = req.maxRetries ?? 2;
    let lastError = "";
    let generatedCode = "";

    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      // Build the prompt - include error context if retrying
      const systemPrompt = `You are a code generator. Output ONLY valid ${req.language} code, no explanations or markdown.`;
      const userPrompt = lastError
        ? `${req.prompt}\n\nPrevious attempt failed with error:\n${lastError}\n\nFix the code.`
        : req.prompt;

      // Call Claude to generate code
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey(),
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5",
          max_tokens: 1024,
          messages: [
            { role: "user", content: `${systemPrompt}\n\n${userPrompt}` }
          ],
        }),
      });

      const data = await response.json();
      let generatedCode = data.content[0].text;

      // Strip markdown code blocks if present
      generatedCode = generatedCode.replace(/```\w*\n/g, "").replace(/```/g, "").trim();

      // Execute in Daytona sandbox
      const sandbox = await daytona.create({ language: req.language });

      try {
        const result = await sandbox.process.codeRun(generatedCode);

        if (result.exitCode === 0) {
          return {
            code: generatedCode,
            output: result.result || "",
            success: true,
            attempts: attempt,
          };
        }

        // Code failed - save error for retry
        lastError = result.stderr || result.result || "Unknown error";
      } finally {
        await sandbox.delete();
      }
    }

    // All retries exhausted
    return {
      code: generatedCode,
      output: lastError,
      success: false,
      attempts: maxRetries + 1,
    };
  }
);

