import { api } from "encore.dev/api";
import { daytona } from "./daytona";
import { db } from "./db";
import log from "encore.dev/log";

interface ExecuteRequest {
  code: string;
  language: "python" | "typescript" | "javascript";
  userId?: string;
}

interface ExecuteResponse {
  id: string;
  output: string;
  error?: string;
  exitCode: number;
  executionTimeMs: number;
}

export const execute = api(
  { expose: true, method: "POST", path: "/execute" },
  async (req: ExecuteRequest): Promise<ExecuteResponse> => {
    const startTime = Date.now();
    const executionId = `exec-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

    log.info("Creating sandbox", { executionId, language: req.language });

    // Create a new sandbox for this execution
    const sandbox = await daytona.create({
      language: req.language,
    });

    try {
      log.info("Executing code", { executionId, sandboxId: sandbox.id });

      // Execute the code in the sandbox
      const result = await sandbox.process.codeRun(req.code);

      const executionTime = Date.now() - startTime;

      // Store execution record
      await db.exec`
        INSERT INTO executions (
          id, user_id, language, code, output, error, exit_code, 
          execution_time_ms, sandbox_id
        )
        VALUES (
          ${executionId}, ${req.userId}, ${req.language}, ${req.code},
          ${result.result}, ${result.stderr || null}, ${result.exitCode},
          ${executionTime}, ${sandbox.id}
        )
      `;

      log.info("Execution completed", {
        executionId,
        exitCode: result.exitCode,
        executionTimeMs: executionTime,
      });

      return {
        id: executionId,
        output: result.result || "",
        error: result.stderr || undefined,
        exitCode: result.exitCode,
        executionTimeMs: executionTime,
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      // Store failed execution
      await db.exec`
        INSERT INTO executions (
          id, user_id, language, code, error, exit_code,
          execution_time_ms, sandbox_id
        )
        VALUES (
          ${executionId}, ${req.userId}, ${req.language}, ${req.code},
          ${errorMessage}, -1, ${executionTime}, ${sandbox.id}
        )
      `;

      throw error;
    } finally {
      // Clean up the sandbox
      await sandbox.delete();
      log.info("Sandbox deleted", { executionId, sandboxId: sandbox.id });
    }
  }
);

interface ExecutionRecord {
  id: string;
  language: string;
  code: string;
  output: string | null;
  error: string | null;
  exitCode: number | null;
  executionTimeMs: number | null;
  createdAt: Date;
}

interface HistoryRequest {
  userId: string;
  limit?: number;
}

interface HistoryResponse {
  executions: ExecutionRecord[];
}

export const getHistory = api(
  { expose: true, method: "GET", path: "/execute/history/:userId" },
  async ({ userId, limit = 50 }: HistoryRequest): Promise<HistoryResponse> => {
    const rows = await db.query<{
      id: string;
      language: string;
      code: string;
      output: string | null;
      error: string | null;
      exit_code: number | null;
      execution_time_ms: number | null;
      created_at: Date;
    }>`
      SELECT id, language, code, output, error, exit_code, execution_time_ms, created_at
      FROM executions
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;

    const executions: ExecutionRecord[] = [];
    for await (const row of rows) {
      executions.push({
        id: row.id,
        language: row.language,
        code: row.code,
        output: row.output,
        error: row.error,
        exitCode: row.exit_code,
        executionTimeMs: row.execution_time_ms,
        createdAt: row.created_at,
      });
    }

    return { executions };
  }
);

