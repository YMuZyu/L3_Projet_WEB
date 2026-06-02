// Structure principale de l'app : header + contenu + footer
// Récupère l'état de connexion depuis le contexte global

import { useContext } from 'react'
import { AuthContext } from '../../context/AuthProvider.jsx'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import ContentArea from './ContentArea.jsx'
import '../../styles/layout/AppLayout.css'

export default function AppLayout() {

    // On récupère les infos de connexion depuis le contexte
    const { user, isAuthenticated, isLoading, login, logout } = useContext(AuthContext)

    // On attend que la session soit vérifiée avant d'afficher quoi que ce soit
    if (isLoading) {
        return (
            <div className="app-layout">
                <p>Chargement...</p>
            </div>
        )
    }

    return (
        <div className="app-layout">
            {/* Header : logo, menu, boutons notif et profil */}
            <Header
                user={user}
                isConnected={isAuthenticated}
                onLogout={logout}
            />
            {/* Zone principale : contient le routeur et les pages */}
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