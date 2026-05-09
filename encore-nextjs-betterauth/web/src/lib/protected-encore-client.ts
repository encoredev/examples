import { useMemo } from "react"
import { encoreClient } from "@/lib/encore-client"
import { useAppSelector } from "@/store/hooks"

/**
 * Hook that returns an Encore client configured with the user's authentication token
 * from Redux persisted state. Use this for all authenticated API calls.
 */
export function useAuthenticatedClient() {
  const { token } = useAppSelector((state) => state.auth)

  const authenticatedClient = useMemo(() => {
    if (!token) {
      return encoreClient
    }

    return encoreClient.with({
      auth: { authorization: `Bearer ${token}` },
    })
  }, [token])

  return authenticatedClient
}
