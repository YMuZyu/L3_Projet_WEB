import Dropdown from "../common/Dropdown.jsx"
import NotifList from "./NotifList.jsx"
import '../../styles/notifications/NotifDropdown.css'

export default function NotifDropdown({ isConnected }) {
    return (
        <Dropdown>
            {isConnected 
                ? <NotifList />
                : <p className="notif-empty">Connectez-vous pour voir vos notifications</p>
            }
        </Dropdown>
    )
}