import { useAuth } from '@clerk/nextjs'
import Client, { Local } from './encore-client'

/**
 * Get an authenticated encore API client.
 *
 * Meant to be used to use on the client side.
 */
export function useApiClient() {
  const { getToken } = useAuth()

  return new Client(Local, {
    auth: async () => {
      const token = await getToken();
      return token ?? ''
    }
  })

}
