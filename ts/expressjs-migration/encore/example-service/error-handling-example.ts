import { api, APIError } from "encore.dev/api"; // Default error handler

// Default error handler
// https://encore.dev/docs/ts/develop/errors
export const broken = api(
  { expose: true, method: "GET", path: "/broken" },
  async (): Promise<void> => {
    throw new Error("This is a broken endpoint"); // This will result in a 500 error
  },
);

// Returning specific error code
// https://encore.dev/docs/ts/develop/errors
export const brokenWithErrorCode = api(
  { expose: true, method: "GET", path: "/broken/:id" },
  async ({ id }: { id: string }): Promise<{ user: string }> => {
    if (id.length !== 3) {
      throw APIError.invalidArgument("invalid id format");
    }
    // TODO: Fetch something from the DB
    return { user: "Simon" };
  },
);
