import { useLogto } from '@logto/react'
import { Link } from 'react-router-dom'
import { appConfig } from '../config/logto'

export function Navigation() {
  const { isAuthenticated, signIn, signOut } = useLogto()

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-gray-800">
              Logto Demo
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link to="/protected" className="text-gray-600 hover:text-gray-900">
                Protected Resource
              </Link>
            </div>
          </div>
          <div>
            {isAuthenticated ? (
              <button
                onClick={() => signOut(appConfig.signOutRedirectUri)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => signIn(appConfig.signInRedirectUri)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
