import { APIError, api } from 'encore.dev/api';
import { Service } from 'encore.dev/service';
import * as auth from '~encore/auth';

interface APIResponse {
  session: any;
  user: any;
}

export const APITesting = api(
  {
    method: ['GET'],
    path: '/api/me',
    expose: true,
    auth: true,
  },
  async (): Promise<{ data: APIResponse }> => {
    const authData = auth.getAuthData();
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

export default new Service('api');
