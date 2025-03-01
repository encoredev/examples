import { auth } from '@clerk/nextjs/server';
import Client, { Local } from './encore-client'


/**
 * Get an authenticated encore API client.
 *
 * Meant to be used to use on the server side.
 */
export async function getApiClient() {
  const { getToken } = await auth();

  return new Client(Local, {
    auth: async () => {
      const token = await getToken();
      return token ?? '';
    }
  })
}
