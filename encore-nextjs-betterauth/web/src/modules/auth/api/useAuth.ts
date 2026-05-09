import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { encoreClient } from "@/lib/encore-client"
import { isAPIError } from "@/lib/client"

interface SignInParams {
  email: string
  password: string
}

interface SignInResponse {
  user: {
    id: string
    email: string
    name: string
  }
  session: {
    token: string
    expiresAt: string
  }
}

export function useSignIn(
  options?: UseMutationOptions<SignInResponse, Error, SignInParams>,
) {
  return useMutation<SignInResponse, Error, SignInParams>({
    mutationFn: async (params: SignInParams) => {
      try {
        const response = await encoreClient.auth.signIn(params)
        return response
      } catch (error) {
        if (isAPIError(error)) {
          throw new Error(error.message || "Login failed. Please try again.")
        }
        throw new Error("An unexpected error occurred. Please try again.")
      }
    },
    ...options,
  })
}

interface SignUpParams {
  email: string
  password: string
  name: string
}

export function useSignUp(
  options?: UseMutationOptions<SignInResponse, Error, SignUpParams>,
) {
  return useMutation<SignInResponse, Error, SignUpParams>({
    mutationFn: async (params: SignUpParams) => {
      try {
        const response = await encoreClient.auth.signUp(params)
        return response
      } catch (error) {
        if (isAPIError(error)) {
          throw new Error(error.message || "Sign up failed. Please try again.")
        }
        throw new Error("An unexpected error occurred. Please try again.")
      }
    },
    ...options,
  })
}

interface SignOutParams {
  token: string
}

export function useSignOut(
  options?: UseMutationOptions<{ success: boolean }, Error, SignOutParams>,
) {
  return useMutation<{ success: boolean }, Error, SignOutParams>({
    mutationFn: async (params: SignOutParams) => {
      try {
        const response = await encoreClient.auth.signOut(params)
        return response
      } catch (error) {
        if (isAPIError(error)) {
          throw new Error(error.message || "Sign out failed. Please try again.")
        }
        throw new Error("An unexpected error occurred. Please try again.")
      }
    },
    ...options,
  })
}
