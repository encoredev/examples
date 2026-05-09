import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Use the frontend URL - Next.js will proxy /api/* to the backend
  baseURL: typeof window !== "undefined" 
    ? window.location.origin 
    : "http://localhost:3002",
});

export const { signIn, signUp, signOut, useSession } = authClient;

