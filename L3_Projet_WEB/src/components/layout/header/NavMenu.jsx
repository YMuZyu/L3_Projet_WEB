import { NavLink } from "react-router-dom";

export default function NavMenu(){
    return (
        <nav className="nav-menu">
            <NavLink to="/">Acceuil</NavLink>
            <NavLink to="/categories">Catégories</NavLink>
        </nav>
    )
}