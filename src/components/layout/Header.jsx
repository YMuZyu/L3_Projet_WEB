import { useState, useRef, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import logo from "../../resources/Sciences_SU.png"
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

    const notifRef = useRef(null)
    const userRef  = useRef(null)

    // Récupérer le compteur de notifications non lues
    useEffect(() => {
        if (!isConnected) { setNotifCount(0); return }

        const fetchCount = async () => {
            try {
                const res = await fetch('http://localhost:10000/notifications/count', { credentials: 'include' })
                if (res.ok) {
                    const data = await res.json()
                    setNotifCount(data.count)
                }
            } catch {}
        }

        fetchCount()
        const interval = setInterval(fetchCount, 30000)
        return () => clearInterval(interval)
    }, [isConnected])

    // Fermer les dropdowns au clic extérieur
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

    const handleNotifOpen = () => {
        setIsNotifOpen(!isNotifOpen)
        setIsUserOpen(false)
    }

    return (
        <header className="header">
            <div className="header-left">
                <div className="logo" onClick={() => navigate('/')}>
                    <img src={logo} alt="Logo du forum" />
                    Forum
                </div>
            </div>

            <div className="header-center">
                <NavMenu isConnected={isConnected} />
            </div>

            <div className='header-right'>
                <div ref={notifRef} className="header-icon-wrapper">
                    <NotifButton
                        onClick={handleNotifOpen}
                        count={notifCount}
                    />
                    {isNotifOpen && (
                        <NotifDropdown
                            isConnected={isConnected}
                            onRead={() => setNotifCount(0)}
                        />
                    )}
                </div>

                <div ref={userRef} className="header-icon-wrapper">
                    <UserButton
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
