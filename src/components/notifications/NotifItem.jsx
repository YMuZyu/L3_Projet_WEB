import '../../styles/notifications/NotifItem.css'

const TYPE_ICONS = {
    reply_post:  '💬',
    reply_reply: '↩️',
    message:     '✉️',
    like_post:   '❤️',
    like_reply:  '❤️',
}

const TYPE_LABELS = {
    reply_post:  'a répondu à votre post',
    reply_reply: 'a répondu à votre réponse',
    message:     'vous a envoyé un message',
    like_post:   'a aimé votre post',
    like_reply:  'a aimé votre réponse',
}

export default function NotifItem({ notification, onClick }) {
    const icon  = TYPE_ICONS[notification.type]  || '🔔'
    const label = TYPE_LABELS[notification.type] || ''

    return (
        <div
            className={`notif-item ${notification.read ? 'read' : 'unread'}`}
            onClick={onClick}
        >
            <span className="notif-icon">{icon}</span>
            <div className="notif-body">
                <p className="notif-text">
                    <strong>{notification.fromUserLogin}</strong> {label}
                </p>
                {notification.preview && (
                    <p className="notif-preview">{notification.preview}</p>
                )}
                <span className="notif-date">
                    {new Date(notification.createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                    })}
                </span>
            </div>
            {!notification.read && <span className="notif-dot" />}
        </div>
    )
}
