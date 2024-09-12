import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import { APIError, Gateway, Header } from "encore.dev/api";
import { authHandler, AuthHandler } from "encore.dev/auth";
import { secret } from "encore.dev/config";
import log from "encore.dev/log";

/**
 * Represents the parameters required for authentication.
 */
interface AuthenticationParameters {
  /** The Authorization header containing the bearer token. */
  authorization: Header<"Authorization">;
}

/**
 * Represents the authenticated user data.
 */
interface AuthenticatedUserData {
  userID: string;
  profileImageUrl: string | null;
  emailAddress: string | null;
}

/**
 * Service for handling Supabase authentication operations.
 */
class SupabaseAuthenticationService {
  private supabaseClient: SupabaseClient;

  /**
   * Creates a new instance of SupabaseAuthenticationService.
   * @param url - The Supabase project URL.
   * @param key - The Supabase API key.
   */
  constructor(url: string, key: string) {
    this.supabaseClient = createClient(url, key);
  }

  /**
   * Retrieves a user based on the provided token.
   * @param token - The authentication token.
   * @returns A Promise that resolves to the User object.
   * @throws {APIError} If the token is invalid or the user is not found.
   */
  async getUserByToken(token: string): Promise<User> {
    const { data: { user }, error } = await this.supabaseClient.auth.getUser(token);
    if (error) throw error;
    if (!user) throw APIError.unauthenticated("Invalid token");
    return user;
  }
}

/**
 * Utility class for mapping Supabase User data to AuthenticatedUserData.
 */
class AuthenticatedUserDataMapper {
  /**
   * Maps a Supabase User object to AuthenticatedUserData.
   * @param user - The Supabase User object.
   * @returns The mapped AuthenticatedUserData object.
   */
  static mapFromSupabaseUser(user: User): AuthenticatedUserData {
    return {
      userID: user.id,
      profileImageUrl: user.user_metadata?.avatar_url || null,
      emailAddress: user.email || null,
    };
  }
}

const authenticationService = new SupabaseAuthenticationService(secret("SUPABASE_URL")(), secret("SUPABASE_KEY")());

/**
 * Supabase authentication handler for Encore.
 */
const supabaseAuthHandler: AuthHandler<AuthenticationParameters, AuthenticatedUserData> = authHandler(
  async (params: AuthenticationParameters): Promise<AuthenticatedUserData | null> => {
    const token = params.authorization.replace('Bearer ', '');

    if (!token) {
      return null;
    }

    try {
      const user = await authenticationService.getUserByToken(token);
      return AuthenticatedUserDataMapper.mapFromSupabaseUser(user);
    } catch (error) {
      log.error(error);
      return null;
    }
  }
);

/**
 * The Encore Gateway instance with Supabase authentication.
 */
export const gateway = new Gateway({ authHandler: supabaseAuthHandler });