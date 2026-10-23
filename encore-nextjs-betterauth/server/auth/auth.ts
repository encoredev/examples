// auth/auth.ts
import { api } from "encore.dev/api"
import { auth } from "./better-auth"
import log from "encore.dev/log"

// Register a new user
interface SignUpRequest {
  email: string
  password: string
  name: string
}

interface AuthResponse {
  user: {
    id: string
    email: string
    name: string
  }
  session: {
    token: string
    expiresAt: Date
  }
}

export const signUp = api(
  { expose: true, method: "POST", path: "/auth/signup" },
  async (req: SignUpRequest): Promise<AuthResponse> => {
    log.info("User signup attempt", { email: req.email })

    // Use BetterAuth to create user
    const result = await auth.api.signUpEmail({
      body: {
        email: req.email,
        password: req.password,
        name: req.name,
      },
    })

    if (!result.user || !result.token) {
      throw new Error("Failed to create user")
    }

    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
      },
      session: {
        token: result.token,
        expiresAt: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000), // 7 days from now
      },
    }
  },
)

// Login existing user
interface SignInRequest {
  email: string
  password: string
}

export const signIn = api(
  { expose: true, method: "POST", path: "/auth/signin" },
  async (req: SignInRequest): Promise<AuthResponse> => {
    log.info("User signin attempt", { email: req.email })

    const result = await auth.api.signInEmail({
      body: {
        email: req.email,
        password: req.password,
      },
    })

    if (!result.user || !result.token) {
      throw new Error("Invalid credentials")
    }

    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
      },
      session: {
        token: result.token,
        expiresAt: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000), // 7 days from now
      },
    }
  },
)

// Logout user
interface SignOutRequest {
  token: string
}

export const signOut = api(
  { expose: true, method: "POST", path: "/auth/signout" },
  async (req: SignOutRequest): Promise<{ success: boolean }> => {
    await auth.api.signOut({
      headers: {
        authorization: `Bearer ${req.token}`,
      },
    })

    return { success: true }
  },
)
