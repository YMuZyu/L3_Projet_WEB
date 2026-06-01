import '../../styles/notifications/NotifItem.css'

export default function NotifItem({ notification }) {
    return (
        <div className={`notif-item ${notification.read ? "read" : "unread"}`}>
            <p>{notification.message}</p>
        </div>
    )
}