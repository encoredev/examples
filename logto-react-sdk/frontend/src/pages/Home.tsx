import { useLogto } from '@logto/react'
import { Link } from 'react-router-dom'

export function Home() {
  const { isAuthenticated } = useLogto()
  
  return (
    <div className="max-w-3xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Welcome to Logto & Encore Demo
      </h1>
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <p className="text-xl text-gray-700 mb-6">
          {isAuthenticated 
            ? 'You are successfully signed in! You can now access protected resources.'
            : 'Please sign in to access protected resources.'}
        </p>
        {!isAuthenticated && (
          <p className="text-gray-600">
            Click the "Sign In" button in the navigation bar to get started.
          </p>
        )}
        {isAuthenticated && (
          <Link
            to="/protected"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md"
          >
            View protected resources
          </Link>
        )}
      </div>
    </div>
  )
}
