import { createClerkClient } from "@clerk/backend";
import { secret } from "encore.dev/config";

const clerkSecretKey = secret("ClerkSecretKey");

export const clerk = createClerkClient({
  secretKey: clerkSecretKey(),
});

