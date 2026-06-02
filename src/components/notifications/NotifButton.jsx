// Bouton cloche dans le header avec badge de compteur de notifications non lues

import '../../styles/layout/Header.css'

export default function NotifButton({ onClick, count }) {
    return (
        <button className="header-button notif-button-wrap" onClick={onClick}>
            <img src="/notification.png" alt="notifications" style={{ width: '1.2em', verticalAlign: 'middle' }} />
            {count > 0 && (
                <span className="notif-badge">{count > 99 ? '99+' : count}</span>
            )}
        </button>
    )
}
