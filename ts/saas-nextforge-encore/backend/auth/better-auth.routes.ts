/**
	 * WARNING: This file is generated automatically. Do not edit. use/create generator plugins to override.
	 */
import { api } from "encore.dev/api";
import { auth } from './encore.service.js';

interface SignInSocialParams {
  callbackURL?: string
  newUserCallbackURL?: string
  errorCallbackURL?: string
  provider: "apple" | "discord" | "facebook" | "github" | "microsoft" | "google" | "spotify" | "twitch" | "twitter" | "dropbox" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "vk"
  disableRedirect?: boolean
  idToken?: any
  scopes?: any[]
  requestSignUp?: boolean
}
interface SignInSocialResponse {
  session: string
  user: any
  url: string
  redirect: boolean
}


// Sign in with a social provider
export const signInSocial = api(
    { method: ["POST"], path: "/auth/sign-in/social", expose: true, tags: ["/sign-in/social"] },
    async (params: SignInSocialParams): Promise<{ data: SignInSocialResponse }> => {
        // Using "as" to ignore response inconsistency from OpenAPI, to be resolved with PR https://github.com/better-auth/better-auth/pull/1699
        return await auth.routeHandlers.signInSocial(params) as { data: SignInSocialResponse };
    }
);

interface CallbackOAuthParams {
  id: string
  state?: string
  code?: string
  device_id?: string
  error?: string
  error_description?: string
}

// API endpoint
export const callbackOAuth = api(
    { method: ["GET", "POST"], path: "/auth/callback/:id", expose: true, tags: ["/callback/:id"] },
    async (params: CallbackOAuthParams): Promise<{ data: any }> => {
        // Using "as" to ignore response inconsistency from OpenAPI, to be resolved with PR https://github.com/better-auth/better-auth/pull/1699
        return await auth.routeHandlers.callbackOAuth(params) as { data: any };
    }
);

interface GetSessionResponse {
  session?: any
  user?: any
}

// Get the current session
export const getSession = api(
    { method: ["GET"], path: "/auth/get-session", expose: true, tags: ["/get-session"] },
    async (): Promise<{ data: GetSessionResponse }> => {
        // Using "as" to ignore response inconsistency from OpenAPI, to be resolved with PR https://github.com/better-auth/better-auth/pull/1699
        return await auth.routeHandlers.getSession() as { data: GetSessionResponse };
    }
);

interface SignOutResponse {
  success?: boolean
}

// Sign out the current user
export const signOut = api(
    { method: ["POST"], path: "/auth/sign-out", expose: true, tags: ["/sign-out"] },
    async (): Promise<{ data: SignOutResponse }> => {
        // Using "as" to ignore response inconsistency from OpenAPI, to be resolved with PR https://github.com/better-auth/better-auth/pull/1699
        return await auth.routeHandlers.signOut() as { data: SignOutResponse };
    }
);

interface SignUpEmailParams {
  name: string
  email: string
  password: string
  username?: string
  displayUsername?: string
}
interface SignUpEmailResponseUser {
  id: string
  email: string
  name: string
  image?: string | null | undefined
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
  username?: string
  displayUsername?: string
}
interface SignUpEmailResponse {
  token: null
  user: SignUpEmailResponseUser
}


// Sign up a user using email and password
export const signUpEmail = api(
    { method: ["POST"], path: "/auth/sign-up/email", expose: true, tags: ["/sign-up/email"] },
    async (params: SignUpEmailParams): Promise<{ data: SignUpEmailResponse }> => {
        // Using "as" to ignore response inconsistency from OpenAPI, to be resolved with PR https://github.com/better-auth/better-auth/pull/1699
        return await auth.routeHandlers.signUpEmail(params) as { data: SignUpEmailResponse };
    }
);

interface SignInEmailParams {
  email: string
  password: string
  callbackURL?: string
  rememberMe?: any
}
interface SignInEmailResponse {
  user: any
  url: string
  redirect: boolean
}


// Sign in with email and password
export const signInEmail = api(
    { method: ["POST"], path: "/auth/sign-in/email", expose: true, tags: ["/sign-in/email"] },
    async (params: SignInEmailParams): Promise<{ data: SignInEmailResponse }> => {
        // Using "as" to ignore response inconsistency from OpenAPI, to be resolved with PR https://github.com/better-auth/better-auth/pull/1699
        return await auth.routeHandlers.signInEmail(params) as { data: SignInEmailResponse };
    }
);

interface ForgetPasswordParams {
  email: string
  redirectTo?: string
}
interface ForgetPasswordResponse {
  status?: boolean
}


// Send a password reset email to the user
export const forgetPassword = api(
    { method: ["POST"], path: "/auth/forget-password", expose: true, tags: ["/forget-password"] },
    async (params: ForgetPasswordParams): Promise<{ data: ForgetPasswordResponse }> => {
        // Using "as" to ignore response inconsistency from OpenAPI, to be resolved with PR https://github.com/better-auth/better-auth/pull/1699
        return await auth.routeHandlers.forgetPassword(params) as { data: ForgetPasswordResponse };
    }
);

interface ResetPasswordParams {
  newPassword: string
  token?: string
}
interface ResetPasswordResponse {
  status?: boolean
}


// Reset the password for a user
export const resetPassword = api(
    { method: ["POST"], path: "/auth/reset-password", expose: true, tags: ["/reset-password"] },
    async (params: ResetPasswordParams): Promise<{ data: ResetPasswordResponse }> => {
        // Using "as" to ignore response inconsistency from OpenAPI, to be resolved with PR https://github.com/better-auth/better-auth/pull/1699
        return await auth.routeHandlers.resetPassword(params) as { data: ResetPasswordResponse };
    }
);

interface VerifyEmailParams {
  token: string
  callbackURL?: string
}
interface VerifyEmailResponse {
  user: any
  status: boolean
}


// Verify the email of the user
export const verifyEmail = api(
    { method: ["GET"], path: "/auth/verify-email", expose: true, tags: ["/verify-email"] },
    async (_: VerifyEmailParams): Promise<{ data: VerifyEmailResponse }> => {
        // Using "as" to ignore response inconsistency from OpenAPI, to be resolved with PR https://github.com/better-auth/better-auth/pull/1699
        return await auth.routeHandlers.verifyEmail() as { data: VerifyEmailResponse };
    }
);

interface SendVerificationEmailParams {
  email: string
  callbackURL?: string
}
interface SendVerificationEmailResponse {
  status?: boolean
}


// Send a verification email to the user
export const sendVerificationEmail = api(
    { method: ["POST"], path: "/auth/send-verification-email", expose: true, tags: ["/send-verification-email"] },
    async (params: SendVerificationEmailParams): Promise<{ data: SendVerificationEmailResponse }> => {
        // Using "as" to ignore response inconsistency from OpenAPI, to be resolved with PR https://github.com/better-auth/better-auth/pull/1699
        return await auth.routeHandlers.sendVerificationEmail(params) as { data: SendVerificationEmailResponse };
    }
);

interface ChangeEmailParams {
  newEmail: string
  callbackURL?: string
}
interface ChangeEmailResponse {
  user?: any
  status?: boolean
}


// API endpoint
export const changeEmail = api(
    { method: ["POST"], path: "/auth/change-email", expose: true, tags: ["/change-email"] },
    async (params: ChangeEmailParams): Promise<{ data: ChangeEmailResponse }> => {
        // Using "as" to ignore response inconsistency from OpenAPI, to be resolved with PR https://github.com/better-auth/better-auth/pull/1699
        return await auth.routeHandlers.changeEmail(params) as { data: ChangeEmailResponse };
    }
);

interface ChangePasswordParams {
  newPassword: string
  currentPassword: string
  revokeOtherSessions?: boolean
}
interface ChangePasswordResponse {
  user?: any
}


// Change the password of the user
export const changePassword = api(
    { method: ["POST"], path: "/auth/change-password", expose: true, tags: ["/change-password"] },
    async (params: ChangePasswordParams): Promise<{ data: ChangePasswordResponse }> => {
        // Using "as" to ignore response inconsistency from OpenAPI, to be resolved with PR https://github.com/better-auth/better-auth/pull/1699
        return await auth.routeHandlers.changePassword(params) as { data: ChangePasswordResponse };
    }
);

interface UpdateUserParams {
  name?: string
  image?: string | null
  username?: string
  displayUsername?: string
}
interface UpdateUserResponse {
  status: boolean
}


// Update the current user
export const updateUser = api(
    { method: ["POST"], path: "/auth/update-user", expose: true, tags: ["/update-user"] },
    async (params: UpdateUserParams): Promise<{ data: UpdateUserResponse }> => {
        // Using "as" to ignore response inconsistency from OpenAPI, to be resolved with PR https://github.com/better-auth/better-auth/pull/1699
        return await auth.routeHandlers.updateUser(params) as { data: UpdateUserResponse };
    }
);

interface DeleteUserParams {
  callbackURL?: string
  password?: string
  token?: string
}
interface DeleteUserResponse {

}


// Delete the user
export const deleteUser = api(
    { method: ["POST"], path: "/auth/delete-user", expose: true, tags: ["/delete-user"] },
    async (params: DeleteUserParams): Promise<{ data: DeleteUserResponse }> => {
        // Using "as" to ignore response inconsistency from OpenAPI, to be resolved with PR https://github.com/better-auth/better-auth/pull/1699
        return await auth.routeHandlers.deleteUser(params) as { data: DeleteUserResponse };
    }
);

interface ForgetPasswordCallbackParams {
  token: string
  callbackURL: string
}
interface ForgetPasswordCallbackResponse {
  token?: string
}


// Redirects the user to the callback URL with the token
export const forgetPasswordCallback = api(
    { method: ["GET"], path: "/auth/reset-password/:token", expose: true, tags: ["/reset-password/:token"] },
    async (_: ForgetPasswordCallbackParams): Promise<{ data: ForgetPasswordCallbackResponse }> => {
        // Using "as" to ignore response inconsistency from OpenAPI, to be resolved with PR https://github.com/better-auth/better-auth/pull/1699
        return await auth.routeHandlers.forgetPasswordCallback() as { data: ForgetPasswordCallbackResponse };
    }
);


// List all active sessions for the user
export const listSessions = api(
    { method: ["GET"], path: "/auth/list-sessions", expose: true, tags: ["/list-sessions"] },
    async (): Promise<{ data: any }> => {
        // Using "as" to ignore response inconsistency from OpenAPI, to be resolved with PR https://github.com/better-auth/better-auth/pull/1699
        return await auth.routeHandlers.listSessions() as { data: any };
    }
);

interface RevokeSessionParams {
  token: string
}

// Revoke a single session
export const revokeSession = api(
    { method: ["POST"], path: "/auth/revoke-session", expose: true, tags: ["/revoke-session"] },
    async (params: RevokeSessionParams): Promise<{ data: any }> => {
        // Using "as" to ignore response inconsistency from OpenAPI, to be resolved with PR https://github.com/better-auth/better-auth/pull/1699
        return await auth.routeHandlers.revokeSession(params) as { data: any };
    }
);

interface RevokeSessionsResponse {
  status: boolean
}

// Revoke all sessions for the user
export const revokeSessions = api(
    { method: ["POST"], path: "/auth/revoke-sessions", expose: true, tags: ["/revoke-sessions"] },
    async (): Promise<{ data: RevokeSessionsResponse }> => {
        // Using "as" to ignore response inconsistency from OpenAPI, to be resolved with PR https://github.com/better-auth/better-auth/pull/1699
        return await auth.routeHandlers.revokeSessions() as { data: RevokeSessionsResponse };
    }
);

interface RevokeOtherSessionsResponse {
  status?: boolean
}

// Revoke all other sessions for the user except the current one
export const revokeOtherSessions = api(
    { method: ["POST"], path: "/auth/revoke-other-sessions", expose: true, tags: ["/revoke-other-sessions"] },
    async (): Promise<{ data: RevokeOtherSessionsResponse }> => {
        // Using "as" to ignore response inconsistency from OpenAPI, to be resolved with PR https://github.com/better-auth/better-auth/pull/1699
        return await auth.routeHandlers.revokeOtherSessions() as { data: RevokeOtherSessionsResponse };
    }
);

interface LinkSocialAccountParams {
  callbackURL?: string
  provider: "apple" | "discord" | "facebook" | "github" | "microsoft" | "google" | "spotify" | "twitch" | "twitter" | "dropbox" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "vk"
}
interface LinkSocialAccountResponse {
  url: string
  redirect: boolean
}


// Link a social account to the user
export const linkSocialAccount = api(
    { method: ["POST"], path: "/auth/link-social", expose: true, tags: ["/link-social"] },
    async (params: LinkSocialAccountParams): Promise<{ data: LinkSocialAccountResponse }> => {
        // Using "as" to ignore response inconsistency from OpenAPI, to be resolved with PR https://github.com/better-auth/better-auth/pull/1699
        return await auth.routeHandlers.linkSocialAccount(params) as { data: LinkSocialAccountResponse };
    }
);


// List all accounts linked to the user
export const listUserAccounts = api(
    { method: ["GET"], path: "/auth/list-accounts", expose: true, tags: ["/list-accounts"] },
    async (): Promise<{ data: any }> => {
        // Using "as" to ignore response inconsistency from OpenAPI, to be resolved with PR https://github.com/better-auth/better-auth/pull/1699
        return await auth.routeHandlers.listUserAccounts() as { data: any };
    }
);

interface DeleteUserCallbackParams {
  token: string
  callbackURL?: string
}

// API endpoint
export const deleteUserCallback = api(
    { method: ["GET"], path: "/auth/delete-user/callback", expose: true, tags: ["/delete-user/callback"] },
    async (_: DeleteUserCallbackParams): Promise<{ data: any }> => {
        // Using "as" to ignore response inconsistency from OpenAPI, to be resolved with PR https://github.com/better-auth/better-auth/pull/1699
        return await auth.routeHandlers.deleteUserCallback() as { data: any };
    }
);

interface UnlinkAccountParams {
  providerId: string
}

// API endpoint
export const unlinkAccount = api(
    { method: ["POST"], path: "/auth/unlink-account", expose: true, tags: ["/unlink-account"] },
    async (params: UnlinkAccountParams): Promise<{ data: any }> => {
        // Using "as" to ignore response inconsistency from OpenAPI, to be resolved with PR https://github.com/better-auth/better-auth/pull/1699
        return await auth.routeHandlers.unlinkAccount(params) as { data: any };
    }
);

interface SignInUsernameParams {
  username: string
  password: string
  rememberMe?: boolean
}
interface SignInUsernameResponse {
  user?: any
  session?: any
}


// Sign in with username
export const signInUsername = api(
    { method: ["POST"], path: "/auth/sign-in/username", expose: true, tags: ["/sign-in/username"] },
    async (params: SignInUsernameParams): Promise<{ data: SignInUsernameResponse }> => {
        // Using "as" to ignore response inconsistency from OpenAPI, to be resolved with PR https://github.com/better-auth/better-auth/pull/1699
        return await auth.routeHandlers.signInUsername(params) as { data: SignInUsernameResponse };
    }
);

interface CreateApiKeyParams {
  name?: string
  expiresIn: any
  userId?: string
  prefix?: string
  remaining: any
  metadata?: any
  refillAmount?: number
  refillInterval?: number
  rateLimitTimeWindow?: number
  rateLimitMax?: number
  rateLimitEnabled?: boolean
  permissions?: any
}

// API endpoint
export const createApiKey = api(
    { method: ["POST"], path: "/auth/api-key/create", expose: true, tags: ["/api-key/create"] },
    async (params: CreateApiKeyParams): Promise<{ data: any }> => {
        // Using "as" to ignore response inconsistency from OpenAPI, to be resolved with PR https://github.com/better-auth/better-auth/pull/1699
        return await auth.routeHandlers.createApiKey(params) as { data: any };
    }
);

interface GetApiKeyParams {
  id: string
}

// API endpoint
export const getApiKey = api(
    { method: ["GET"], path: "/auth/api-key/get", expose: true, tags: ["/api-key/get"] },
    async (_: GetApiKeyParams): Promise<{ data: any }> => {
        // Using "as" to ignore response inconsistency from OpenAPI, to be resolved with PR https://github.com/better-auth/better-auth/pull/1699
        return await auth.routeHandlers.getApiKey() as { data: any };
    }
);

interface UpdateApiKeyParams {
  keyId: string
  userId?: string
  name?: string
  enabled?: boolean
  remaining?: number
  refillAmount?: number
  refillInterval?: number
  metadata?: any
  expiresIn?: any
  rateLimitEnabled?: boolean
  rateLimitTimeWindow?: number
  rateLimitMax?: number
  permissions?: any
}

// API endpoint
export const updateApiKey = api(
    { method: ["POST"], path: "/auth/api-key/update", expose: true, tags: ["/api-key/update"] },
    async (params: UpdateApiKeyParams): Promise<{ data: any }> => {
        // Using "as" to ignore response inconsistency from OpenAPI, to be resolved with PR https://github.com/better-auth/better-auth/pull/1699
        return await auth.routeHandlers.updateApiKey(params) as { data: any };
    }
);

interface DeleteApiKeyParams {
  keyId: string
}

// API endpoint
export const deleteApiKey = api(
    { method: ["DELETE"], path: "/auth/api-key/delete", expose: true, tags: ["/api-key/delete"] },
    async (params: DeleteApiKeyParams): Promise<{ data: any }> => {
        // Using "as" to ignore response inconsistency from OpenAPI, to be resolved with PR https://github.com/better-auth/better-auth/pull/1699
        return await auth.routeHandlers.deleteApiKey(params) as { data: any };
    }
);


// API endpoint
export const listApiKeys = api(
    { method: ["GET"], path: "/auth/api-key/list", expose: true, tags: ["/api-key/list"] },
    async (): Promise<{ data: any }> => {
        // Using "as" to ignore response inconsistency from OpenAPI, to be resolved with PR https://github.com/better-auth/better-auth/pull/1699
        return await auth.routeHandlers.listApiKeys() as { data: any };
    }
);

interface OkResponse {
  ok?: boolean
}

// Check if the API is working
export const ok = api(
    { method: ["GET"], path: "/auth/ok", expose: true, tags: ["/ok"] },
    async (): Promise<{ data: OkResponse }> => {
        // Using "as" to ignore response inconsistency from OpenAPI, to be resolved with PR https://github.com/better-auth/better-auth/pull/1699
        return await auth.routeHandlers.ok() as { data: OkResponse };
    }
);


// Displays an error page
export const error = api(
    { method: ["GET"], path: "/auth/error", expose: true, tags: ["/error"] },
    async (): Promise<{ data: any }> => {
        // Using "as" to ignore response inconsistency from OpenAPI, to be resolved with PR https://github.com/better-auth/better-auth/pull/1699
        return await auth.routeHandlers.error() as { data: any };
    }
);