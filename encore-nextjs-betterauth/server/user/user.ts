// profile/profile.ts
import { api } from "encore.dev/api"
import { getAuthData } from "~encore/auth"
import log from "encore.dev/log"
import { db } from "../auth/db"
import { user } from "../auth/schema"
import { eq } from "drizzle-orm"

interface UserProfile {
  id: string
  email: string
  name: string
}

export const currentUser = api(
  {
    expose: true,
    auth: true, // Requires authentication
    method: "GET",
    path: "/current-user",
  },
  async (): Promise<UserProfile> => {
    // Get authenticated user data from auth handler
    const authData = getAuthData()!

    log.info("Profile accessed", { userID: authData.userID })

    return {
      id: authData.userID,
      email: authData.email,
      name: authData.name,
    }
  },
)

interface UpdateProfileRequest {
  name: string
}

export const updateProfile = api(
  {
    expose: true,
    auth: true,
    method: "PUT",
    path: "/update",
  },
  async (req: UpdateProfileRequest): Promise<UserProfile> => {
    const authData = getAuthData()!

    log.info("Profile update", {
      userID: authData.userID,
      newName: req.name,
    })

    // Update the user's name in the database
    const [updatedUser] = await db
      .update(user)
      .set({
        name: req.name,
        // email: req.email, // update the mail in future
        updatedAt: new Date(),
      })
      .where(eq(user.id, authData.userID))
      .returning()

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
    }
  },
)
