import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import Client, {Local} from './lib/client'
import './App.css'

export default function App() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [adminData, setAdminData] = useState<any>(null)

  useEffect(() => {
    async function getSession() {
      try {
        setLoading(true)
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        setSession(data.session)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      setSession(null)
      setAdminData(null)
    } catch (e: any) {
      setError(e.message)
    }
  }

  const handleAdminRequest = async (token?: string) => {
    try {
      setError(null)
      setAdminData(null)
      const client = new Client(Local, {
        auth: token ? {
          authorization: `Bearer ${token}`
        } : undefined
      })
      const data = await client.admin.getDashboardData()
      setAdminData(data)
    } catch (e: any) {
      setError(e.message)
    }
  }

  const handleInvalidTokenRequest = async () => {
    await handleAdminRequest('invalid_token')
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="container">
      <div className="card">
        {error && <div className="error">Error: {error}</div>}
        {!session ? (
          <>
            <h1>Welcome</h1>
            <p>Please log in to continue.</p>
            <Auth 
              supabaseClient={supabase} 
              appearance={{ 
                theme: ThemeSupa,
                style: {
                  button: {
                    background: '#4A90E2',
                    color: 'white',
                    borderRadius: '4px',
                  },
                  input: {
                    borderRadius: '4px',
                  },
                },
              }} 
            />
            <button onClick={() => handleAdminRequest()} className="test-btn">
              Test API (No Token)
            </button>
            <button onClick={handleInvalidTokenRequest} className="test-btn">
              Test API (Invalid Token)
            </button>
          </>
        ) : (
          <div className="logged-in">
            <h1>Welcome back!</h1>
            <p>You are logged in as: <strong>{session.user.email}</strong></p>
            <button onClick={() => handleAdminRequest(session.access_token)} className="test-btn">
              Test API (With Token)
            </button>
            <button onClick={handleInvalidTokenRequest} className="test-btn">
              Test API (Invalid Token)
            </button>
            <button onClick={handleSignOut} className="sign-out-btn">Sign Out</button>
          </div>
        )}
        {adminData && (
          <div className="admin-data">
            <h2>API Data:</h2>
            <pre>{JSON.stringify(adminData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}