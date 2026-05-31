import { useState } from 'react'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import ContentArea from './ContentArea.jsx'
import '../../styles/layout/AppLayout.css'

export default function AppLayout() {
  const [user, setUser] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  const handleLogin = (userData) => {
    setUser(userData)
    setIsConnected(true)
  }

  const handleLogout = () => {
    setUser(null)
    setIsConnected(false)
  }

  return (
    <div className="app-layout">
      <Header user={user} isConnected={isConnected} onLogout={handleLogout} />
      <ContentArea
        user={user}
        isConnected={isConnected}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      <Footer />
    </div>
  )
}