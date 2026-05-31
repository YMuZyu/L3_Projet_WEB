import { useState, useRef, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import logo from "../../resources/Sciences_SU.png"
import NotifButton from '../notifications/NotifButton.jsx'
import NotifDropdown from '../notifications/NotifDropdown.jsx'
import UserButton from '../nav/UserButton.jsx'
import UserDropdown from '../nav/UserDropdown.jsx'
import '../../styles/layout/Header.css'

export default function Header({ user, isConnected, onLogout }) {

    const navigate = useNavigate()

    const [isNotifOpen, setIsNotifOpen] = useState(false)
    const [isUserOpen, setIsUserOpen] = useState(false)

    const notifRef = useRef(null)
    const userRef = useRef(null)

    // Fermer le dropdown quand l'utilisateir clique un endroit ailleurs
    useEffect( () => {
        function closeDropdown(event){
            if (notifRef.current && !notifRef.current.contains(event.target)){
                setIsNotifOpen(false)
            }
            if (userRef.current && !userRef.current.contains(event.target)){
                setIsUserOpen(false)
            }
        }
        document.addEventListener('mousedown', closeDropdown)
        return () => document.removeEventListener('mousedown', closeDropdown)
    }, [])

    return (
        <header className="header">
            <div className="header-left">
                <div className="logo" onClick={() => navigate('/')}>
                    <img src={logo} alt="Logo du forum" />
                    Forum
                </div>
            </div>

            <div className='header-right'>
                <div ref={notifRef}>
                    <NotifButton 
                        onClick={() => {
                            setIsNotifOpen(!isNotifOpen)
                            setIsUserOpen(false)
                        }}
                    />
                    {isNotifOpen && <NotifDropdown buttonRef={notifRef} isConnected={isConnected} />}
                </div>
                
                <div ref={userRef}>
                    <UserButton 
                        onClick={() => {
                            setIsUserOpen(!isUserOpen)
                            setIsNotifOpen(false)
                        }}
                    />
                    {isUserOpen && <UserDropdown buttonRef={userRef} user={user} isConnected={isConnected} onLogout={onLogout} />}
                </div>
            </div>

        </header>
    )
}