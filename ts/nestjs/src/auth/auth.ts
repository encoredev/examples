import { APIError, Gateway, Header } from 'encore.dev/api';
import { authHandler } from 'encore.dev/auth';

interface AuthParams {
  authorization: Header<'Authorization'>;
}

interface AuthData {
  userID: string;
  emailAddress: string | null;
}

// The function passed to authHandler will be called for all incoming API call that requires authentication.
const myAuthHandler = authHandler(
  async (params: AuthParams): Promise<AuthData> => {
    if (!params.authorization) {
      throw APIError.unauthenticated('no token provided');
    }

    try {
      // Verify token using for example Clerk or Auth0
      // Get user data

      return {
        userID: 'abc123',
        emailAddress: 'user@example.com',
      };
    } catch (e) {
      throw APIError.unauthenticated('invalid token', e as Error);
    }
  },
);

export const mygw = new Gateway({ authHandler: myAuthHandler });
