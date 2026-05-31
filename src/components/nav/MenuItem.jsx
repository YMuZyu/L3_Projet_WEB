import { useNavigate } from "react-router-dom"
import '../../styles/nav/MenuItem.css'

export default function MenuItem({ label, to, onClick }) {
    const navigate = useNavigate()
    
    /* 
    accepte soit un to pour naviguer vers une route
    soit un onClick pour déclencher une action (comme la déconnexion)
    soit les deux
    */
    const handleClick = () => {
        if (onClick) onClick()
        if (to) navigate(to)
    }

    return (
        <button className="menu-item" onClick={handleClick}>
            {label}
        </button>
    )
}