// Bouton de navigation réutilisable
// utilise NavLink pour afficher l'état actif automatiquement

import { NavLink } from "react-router-dom"
import '../../styles/nav/MenuItem.css'

export default function MenuItem({ label, to, onClick }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}
            onClick={onClick}
        >
            {label}
        </NavLink>
    )
}