// Barre du haut fixe : logo à gauche, menu au centre, notifications et profil à droite
// Gère l'ouverture/fermeture des dropdowns et le compteur de notifications

import { useState, useRef, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import logo from "../../../public/logo.png"
import NavMenu from '../nav/NavMenu.jsx'
import NotifButton from '../notifications/NotifButton.jsx'
import NotifDropdown from '../notifications/NotifDropdown.jsx'
import UserButton from '../nav/UserButton.jsx'
import UserDropdown from '../nav/UserDropdown.jsx'
import '../../styles/layout/Header.css'

export default function Header({ user, isConnected, onLogout }) {

    const navigate = useNavigate()

    const [isNotifOpen, setIsNotifOpen] = useState(false)
    const [isUserOpen,  setIsUserOpen]  = useState(false)
    const [notifCount,  setNotifCount]  = useState(0)

    // Références pour détecter les clics en dehors des dropdowns
    const notifRef = useRef(null)
    const userRef  = useRef(null)

    // Récupère le nombre de notifications non lues toutes les 30 secondes
    useEffect(() => {
        if (!isConnected) { setNotifCount(0); return }

        const fetchCount = async () => {
            try {
                const res = await fetch('http://localhost:10000/notifications/count', { 
                    credentials: 'include' 
                })
                if (res.ok) {
                    const data = await res.json()
                    setNotifCount(data.count)
                }
            } catch {}
        }

        fetchCount()
        const interval = setInterval(fetchCount, 30000)
        return () => clearInterval(interval) // nettoyage à la déconnexion
    }, [isConnected])

    // Ferme les dropdowns quand on clique en dehors
    useEffect(() => {
        function closeDropdown(event) {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setIsNotifOpen(false)
            }
            if (userRef.current && !userRef.current.contains(event.target)) {
                setIsUserOpen(false)
            }
        }
        document.addEventListener('mousedown', closeDropdown)
        return () => document.removeEventListener('mousedown', closeDropdown)
    }, [])

    // Ouvre le dropdown notifs et ferme celui du profil
    const handleNotifOpen = () => {
        setIsNotifOpen(!isNotifOpen)
        setIsUserOpen(false)
    }

    return (
        <header className="header">

            {/* Logo : clique pour revenir à l'accueil */}
            <div className="header-left">
                <div className="logo" onClick={() => navigate('/')}>
                    <img src={logo} alt="Logo du forum" />
                    MixHub
                </div>
            </div>

            {/* Menu de navigation central */}
            <div className="header-center">
                <NavMenu isConnected={isConnected} />
            </div>

            {/* Boutons notifications et profil */}
            <div className='header-right'>

                {/* Bouton historique visible seulement si connecté */}
                {isConnected && (
                    <button
                        className="header-history-btn"
                        onClick={() => navigate('/history')}
                        title="Mon historique"
                    >
                        Historique
                    </button>
                )}

                {/* Bouton notifications avec badge de compteur */}
                <div ref={notifRef} className="header-icon-wrapper">
                    <NotifButton
                        onClick={handleNotifOpen}
                        count={notifCount}
                    />
                    {isNotifOpen && (
                        <NotifDropdown
                            isConnected={isConnected}
                            onRead={() => setNotifCount(0)} // remet le compteur à 0 à l'ouverture
                        />
                    )}
                </div>

                {/* Bouton profil avec dropdown connexion/déconnexion */}
                <div ref={userRef} className="header-icon-wrapper">
                    <UserButton
                        user={user}
                        onClick={() => {
                            setIsUserOpen(!isUserOpen)
                            setIsNotifOpen(false)
                        }}
                    />
                    {isUserOpen && <UserDropdown user={user} isConnected={isConnected} onLogout={onLogout} />}
                </div>
            </div>

        </header>
    )
}
