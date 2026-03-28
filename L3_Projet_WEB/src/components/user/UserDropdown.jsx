import Dropdown from "../common/Dropdown"

function UserDropdown({buttonRef}){
    return (
        <Dropdown buttonRef={buttonRef}>
            <button>Page Profil</button>
            <button>Connexion</button>
            <button>Inscription</button>
            <button>Déconnexion</button>
        </Dropdown>
    )
}

export default UserDropdown