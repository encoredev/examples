import { api } from "encore.dev/api";
import { daytona } from "./daytona";
import log from "encore.dev/log";

interface ExecuteWithFilesRequest {
  code: string;
  language: "python" | "typescript";
  files?: Record<string, string>; // filename -> content
}

interface ExecuteWithFilesResponse {
  output: string;
  filesCreated: string[];
}

export const executeWithFiles = api(
  { expose: true, method: "POST", path: "/execute/files" },
  async (req: ExecuteWithFilesRequest): Promise<ExecuteWithFilesResponse> => {
    const sandbox = await daytona.create({
      language: req.language,
    });

    try {
      // Write input files to sandbox
      if (req.files) {
        for (const [filename, content] of Object.entries(req.files)) {
          await sandbox.fs.uploadFile(Buffer.from(content), filename);
          log.info("Wrote file to sandbox", { filename });
        }
      }

      // Execute the code
      const result = await sandbox.process.codeRun(req.code);

      if (result.exitCode !== 0) {
        throw new Error(`Execution failed: ${result.result}`);
      }

      // List files in the sandbox's working directory, where the input files were uploaded
      const files = await sandbox.fs.listFiles(".");
      const createdFiles = files.map((f) => f.name);

      return {
        output: result.result || "",
        filesCreated: createdFiles,
      };
    } finally {
      await sandbox.delete();
    }
  }
);

