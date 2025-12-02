import { api } from "encore.dev/api";
import { daytona } from "./daytona";

// Execution with timeout
export const executeWithTimeout = api(
  { expose: true, method: "POST", path: "/execute/timeout" },
  async (req: { code: string; language: string; timeoutMs?: number }) => {
    const timeout = req.timeoutMs || 5000;
    const sandbox = await daytona.create({ language: req.language });

    try {
      const result = await Promise.race([
        sandbox.process.codeRun(req.code),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Execution timeout")), timeout)
        ),
      ]);

      return { output: (result as any).result };
    } finally {
      await sandbox.delete();
    }
  }
);

// Execute code from a Git repository
export const executeFromRepo = api(
  { expose: true, method: "POST", path: "/execute/repo" },
  async (req: { repoUrl: string; script: string }) => {
    const sandbox = await daytona.create({ language: "python" });

    try {
      // Clone the repository
      await sandbox.git.clone(req.repoUrl, "/workspace/repo");

      // Execute a script from the repo
      const result = await sandbox.process.codeRun(
        `cd /workspace/repo && ${req.script}`
      );

      return { output: result.result };
    } finally {
      await sandbox.delete();
    }
  }
);

// Code playground endpoint
export const playground = api(
  { expose: true, method: "POST", path: "/playground/run" },
  async (req: { code: string; language: string }) => {
    // Reuse the execute endpoint
    const { execute } = await import("./execute");
    return await execute({
      code: req.code,
      language: req.language as any,
    });
  }
);

// AI coding agent endpoint with test cases
export const aiExecute = api(
  { expose: true, method: "POST", path: "/ai/execute" },
  async (req: { generatedCode: string; language: string; testCases: string[] }) => {
    const sandbox = await daytona.create({ language: req.language });

    try {
      // Run the AI-generated code
      const result = await sandbox.process.codeRun(req.generatedCode);

      // Run test cases
      const testResults = [];
      for (const testCase of req.testCases) {
        const testResult = await sandbox.process.codeRun(testCase);
        testResults.push({
          passed: testResult.exitCode === 0,
          output: testResult.result,
        });
      }

      return {
        executionResult: result.result,
        testResults,
        allTestsPassed: testResults.every((t) => t.passed),
      };
    } finally {
      await sandbox.delete();
    }
  }
);

// Educational platform endpoint
export const submitExercise = api(
  { expose: true, method: "POST", path: "/learn/submit" },
  async (req: {
    studentId: string;
    exerciseId: string;
    solution: string;
    language: string;
  }) => {
    // Reuse the execute endpoint
    const { execute } = await import("./execute");
    
    const result = await execute({
      code: req.solution,
      language: req.language as any,
      userId: req.studentId,
    });

    // Grade the solution based on output
    const passed = result.exitCode === 0 && result.output.includes("expected");

    return {
      passed,
      output: result.output,
      feedback: passed ? "Great job!" : "Try again",
    };
  }
);

