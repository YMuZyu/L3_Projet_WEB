import { useNavigate } from "react-router-dom"
import Dropdown from "../common/Dropdown"

function UserDropdown({buttonRef,isLogged}){
    
    const navigate = useNavigate()

    if(isLogged === true){
        return (
        <Dropdown buttonRef={buttonRef}>
            <button >Page Profil</button>
            <button>Déconnexion</button>
        </Dropdown>
        )
    }
    else{
        return (
        <Dropdown buttonRef={buttonRef}>
            <button onClick={() => navigate("/login")}>Connexion</button>
            <button onClick={() => navigate("/register")}>Inscription</button>
        </Dropdown>
        )
    }

    
}

export default UserDropdown