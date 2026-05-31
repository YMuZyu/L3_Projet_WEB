import { useNavigate } from "react-router-dom"
import Dropdown from "../common/Dropdown.jsx"

export default function UserDropdown({ buttonRef, user, isConnected, onLogout }) {
    
    const navigate = useNavigate()

    if (isConnected) {
        return (
            <Dropdown buttonRef={buttonRef}>
                <button onClick={() => navigate(`/profile/${user?.id}`)}>Page Profil</button>
                <button onClick={onLogout}>Déconnexion</button>
            </Dropdown>
        )
    } else {
        return (
            <Dropdown buttonRef={buttonRef}>
                <button onClick={() => navigate("/login")}>Connexion</button>
                <button onClick={() => navigate("/register")}>Inscription</button>
            </Dropdown>
        )
    }
}