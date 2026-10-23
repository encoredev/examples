"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/store/hooks"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean // true = requires auth, false = requires no auth (for login/signup pages)
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  redirectTo,
}: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      // User needs to be authenticated but isn't - redirect to sign-in
      router.push(redirectTo || "/sign-in")
    } else if (!requireAuth && isAuthenticated) {
      // User shouldn't be authenticated but is - redirect to home
      router.push(redirectTo || "/")
    }
  }, [isAuthenticated, requireAuth, router, redirectTo])

  // Show loading state while redirecting
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    )
  }

  if (!requireAuth && isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    )
  }

  return <>{children}</>
}
