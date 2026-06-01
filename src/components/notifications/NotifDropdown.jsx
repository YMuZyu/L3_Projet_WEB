import Dropdown from "../common/Dropdown.jsx"
import NotifList from "./NotifList.jsx"
import '../../styles/notifications/NotifDropdown.css'

export default function NotifDropdown({ isConnected, onRead }) {
    return (
        <Dropdown>
            {isConnected
                ? <NotifList onRead={onRead} />
                : <p className="notif-empty">Connectez-vous pour voir vos notifications</p>
            }
        </Dropdown>
    )
}
