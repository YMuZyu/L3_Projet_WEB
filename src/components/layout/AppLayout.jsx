import { useContext } from 'react'
import { AuthContext } from '../../context/AuthProvider.jsx'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import ContentArea from './ContentArea.jsx'
import '../../styles/layout/AppLayout.css'

export default function AppLayout() {
    const { user, isAuthenticated, isLoading, login, logout } = useContext(AuthContext)

    if (isLoading) return <p>Chargement...</p>

    return (
        <div className="app-layout">
            <Header
                user={user}
                isConnected={isAuthenticated}
                onLogout={logout}
            />
            <ContentArea
                user={user}
                isConnected={isAuthenticated}
                onLogin={login}
                onLogout={logout}
            />
            <Footer />
        </div>
    )
}