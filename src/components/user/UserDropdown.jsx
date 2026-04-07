import { useNavigate } from "react-router-dom"
import Dropdown from "../common/Dropdown"

function UserDropdown({buttonRef}){
    
    const navigate = useNavigate()

    return (
        <Dropdown buttonRef={buttonRef}>
            <button >Page Profil</button>
            <button onClick={() => navigate("/login")}>Connexion</button>
            <button>Inscription</button>
            <button>Déconnexion</button>
        </Dropdown>
    )
}

export default UserDropdown