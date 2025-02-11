import { LogtoProvider } from '@logto/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { config } from './config/logto'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { ProtectedResource } from './pages/ProtectedResource'
import { Callback } from './pages/Callback'

function App() {
  return (
    <LogtoProvider config={config}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/protected" element={<ProtectedResource />} />
            <Route path="/callback" element={<Callback />} />
          </Routes>
        </Layout>
      </Router>
    </LogtoProvider>
  )
}

export default App
