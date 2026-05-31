import Dropdown from "../common/Dropdown.jsx"
import NotifList from "./NotifList.jsx"

export default function NotifDropdown({ buttonRef, isConnected }) {
    return (
        <Dropdown buttonRef={buttonRef}>
            {isConnected 
                ? <NotifList />
                : <p className="notif-empty">Connectez-vous pour voir vos notifications</p>
            }
        </Dropdown>
    )
}