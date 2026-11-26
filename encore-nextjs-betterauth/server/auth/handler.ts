// auth/handler.ts
import { APIError, Gateway, Header } from "encore.dev/api"
import { authHandler } from "encore.dev/auth"
import { db } from "./db"
import { session, user } from "./schema"
import { eq } from "drizzle-orm"
import log from "encore.dev/log"

// Define what we extract from the Authorization header
interface AuthParams {
  authorization: Header<"Authorization">
}

// Define what authenticated data we make available to endpoints
interface AuthData {
  userID: string
  email: string
  name: string
}

const myAuthHandler = authHandler(async (params: AuthParams): Promise<AuthData> => {
  const token = params.authorization.replace("Bearer ", "")

  if (!token) {
    throw APIError.unauthenticated("no token provided")
  }

  try {
    // Optimized: Single query with JOIN to get both session and user data
    const [result] = await db
      .select({
        userId: user.id,
        email: user.email,
        name: user.name,
        expiresAt: session.expiresAt,
      })
      .from(session)
      .innerJoin(user, eq(session.userId, user.id))
      .where(eq(session.token, token))
      .limit(1)

    // const row = result[0]

    if (!result) {
      throw APIError.unauthenticated("invalid session")
    }

    // Check if session is expired
    if (new Date(result.expiresAt) < new Date()) {
      throw APIError.unauthenticated("session expired")
    }

    return {
      userID: result.userId,
      email: result.email,
      name: result.name,
    }
  } catch (e) {
    log.error(e)
    throw APIError.unauthenticated("invalid token", e as Error)
  }
})

// Create gateway with auth handler
export const gateway = new Gateway({ authHandler: myAuthHandler })
