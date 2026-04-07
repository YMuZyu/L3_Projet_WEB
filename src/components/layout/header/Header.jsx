import { useState, useRef, useEffect } from 'react'

import logo from "../../../resources/Sciences_SU.png"
import NavMenu from './NavMenu'
import NotifButton from '../../notification/NotifButton'
import NotifDropdown from '../../notification/NotifDropdown'
import UserButton from '../../user/UserButton'
import UserDropdown from '../../user/UserDropdown'

import './Header.css'

export default function Header(){
    
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

            <div className="logo">
                <img src={logo} alt="Logo du forum" />
                Forum _ J'ai pas de nom
            </div>

            <NavMenu />

            <div className='header-right'>
                <div ref={notifRef}>
                    <NotifButton 
                        onClick={() => {
                            setIsNotifOpen(!isNotifOpen)
                            setIsUserOpen(false)
                        }}
                    />
                    {isNotifOpen && <NotifDropdown buttonRef={notifRef} />}
                </div>
                
                <div ref={userRef}>
                    <UserButton 
                        onClick={() => {
                            setIsUserOpen(!isUserOpen)
                            setIsNotifOpen(false)
                        }}
                    />
                    {isUserOpen && <UserDropdown buttonRef={userRef} />}
                </div>
            </div>
            
            
        </header>
    )
}