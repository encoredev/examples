import { prismaAdapter } from 'better-auth/adapters/prisma';
import { apiKey, username } from 'better-auth/plugins';
import { encoreBetterAuth } from 'encore-better-auth';
import { currentRequest } from 'encore.dev';
import { APIError, Gateway, type Header, api } from 'encore.dev/api';
import { authHandler } from 'encore.dev/auth';
import { Service } from 'encore.dev/service';
import * as encoreAuth from '~encore/auth';
import { prisma } from './database.js';

// ensure to export auth.
export const auth = encoreBetterAuth({
  currentRequest: currentRequest,
  database: prismaAdapter(prisma, {
    provider: 'sqlite', // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
  },
  basePath: '/auth',
  plugins: [
    username(),
    apiKey({
      rateLimit: {
        enabled: true,
        timeWindow: 1000 * 60 * 60 * 24, // 1 day
        maxRequests: 10, // 10 requests per day
      },
    }),
  ],
  // socialProviders: {
  // 	facebook: {
  // 		clientId: "",
  // 		clientSecret: "",
  // 	},
  // 	google: {
  // 		clientId: "",
  // 		clientSecret: "",
  // 	},
  // },
  generateRoutes: true,
  wrapResponse: true, // must be true.
});

// Encore will consider this directory and all its subdirectories as part of the "users" service.
// https://encore.dev/docs/ts/primitives/services
export default new Service('auth', {
  middlewares: [...auth.middlewares],
});

interface AuthParams {
  cookie: Header<'Cookie'>;
}

interface AuthData {
  userID: string;
  user: any;
  session: any;
}

export const handler = authHandler<AuthParams, AuthData>(async (authdata) => {
  return auth.getValidatedSession(authdata.cookie);
});

export const gateway = new Gateway({ authHandler: handler });

interface MeResponse {
  session: any;
  user: any;
}

export const me = api(
  {
    method: ['GET'],
    path: '/me',
    expose: true,
    auth: true,
  },
  async (): Promise<{ data: MeResponse }> => {
    const authData = encoreAuth.getAuthData();
    if (!authData) {
      throw APIError.unauthenticated('Unauthenticated');
    }
    return {
      data: {
        session: authData.session,
        user: authData.user,
      },
    };
  }
);
