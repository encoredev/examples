import { api } from "encore.dev/api"
import { getAuthData } from "~encore/auth"
import { db, DB } from "../auth/db"
import { auth } from "../auth/better-auth"
import { session } from "../auth/schema"
import { eq } from "drizzle-orm"

interface Session {
  id: string
  expiresAt: Date
  token: string
  createdAt: Date
  updatedAt: Date
  ipAddress: string | null
  userAgent: string | null
  userId: string
}

interface ListSessionsResponse {
  sessions: Session[]
}

export const listSessions = api(
  { expose: true, auth: true, method: "GET", path: "/sessions" },
  async (): Promise<ListSessionsResponse> => {
    const authData = getAuthData()!

    // Query sessions from database for the authenticated user
    const sessions = await db.query.session.findMany({
      where: eq(session.userId, authData.userID),
    })

    return { sessions }
  },
)

interface RevokeSessionResponse {
  success: boolean
}

export const revokeSession = api(
  { expose: true, auth: true, method: "DELETE", path: "/sessions/:id" },
  async ({ id }: { id: string }): Promise<RevokeSessionResponse> => {
    // Get the session token to revoke it
    const sessionToRevoke = await db.query.session.findFirst({
      where: eq(session.id, id),
    })

    if (sessionToRevoke) {
      await auth.api.signOut({
        headers: {
          authorization: `Bearer ${sessionToRevoke.token}`,
        },
      })
    }

    return { success: true }
  },
)
