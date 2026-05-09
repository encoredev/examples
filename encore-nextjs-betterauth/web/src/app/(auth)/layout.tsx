"use client"

import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute
      requireAuth={false}
      redirectTo="/">
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </ProtectedRoute>
  )
}
