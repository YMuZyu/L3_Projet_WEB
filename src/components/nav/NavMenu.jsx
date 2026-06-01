import MenuItem from './MenuItem.jsx'
import '../../styles/nav/NavMenu.css'

export default function NavMenu({ isConnected }) {
    return (
        <nav className="nav-menu">
            <MenuItem label="🏠 Home"       to="/" />
            <MenuItem label="❓ Questions"  to="/questions" />
            <MenuItem label="🏷️ Catégories"  to="/tags" />

            {isConnected && (
                <>
                    <MenuItem label="💬 Messages" to="/messages" />
                    <MenuItem label="➕ Poster"   to="/create" />
                </>
            )}
        </nav>
    )
}