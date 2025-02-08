import { useHandleSignInCallback } from '@logto/react'

export function Callback() {
  const { isLoading } = useHandleSignInCallback(() => {
    // Redirect to home page after sign-in
    window.location.replace('/')
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  return null
}
