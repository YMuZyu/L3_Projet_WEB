// Menu de navigation horizontal dans le header
// Le bouton "Poster" est visible seulement si l'utilisateur est connecté

import MenuItem from './MenuItem.jsx'
import '../../styles/nav/NavMenu.css'

export default function NavMenu({ isConnected }) {
    return (
        <nav className="nav-menu">
            <MenuItem label="Home" to="/" />
            <MenuItem label="Catégories" to="/categories" />

            {isConnected && (
                <>
                    <MenuItem label="✉️ Messages" to="/messages" />
                    <MenuItem label="➕ Poster" to="/create" />
                </>
            )}
        </nav>
    )
}