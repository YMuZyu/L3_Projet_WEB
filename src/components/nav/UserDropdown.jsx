// Dropdown du bouton profil : selon l'état de connexion, affiche les options correspondantes
// Si admin, affiche un lien vers la page d'administration

import { useNavigate } from "react-router-dom"
import Dropdown from "../common/Dropdown.jsx"

export default function UserDropdown({ user, isConnected, onLogout }) {
    
    const navigate = useNavigate()

    if (isConnected) {
        return (
            <Dropdown>
                <button className="dropdown-item" onClick={() => navigate(`/profile/${user?._id}`)}>
                    Page Profil
                </button>

                {/* Lien admin visible seulement pour les administrateurs */}
                {user?.isAdmin && (
                    <button className="dropdown-item" onClick={() => navigate("/admin")}>
                        Administration
                    </button>
                )}
                <button className="dropdown-item" onClick={onLogout}>
                    Déconnexion
                </button>
            </Dropdown>
        )
    } else {
        return (
            <Dropdown>
                <button className="dropdown-item" onClick={() => navigate("/login")}>Connexion</button>
                <button className="dropdown-item" onClick={() => navigate("/register")}>Inscription</button>
            </Dropdown>
        )
    }
}