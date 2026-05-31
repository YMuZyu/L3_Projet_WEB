import NotifItem from "./NotifItem.jsx"

const fakeNotifs = [
    { id: 1, message: "Quelqu'un a répondu à votre post", read: false },
    { id: 2, message: "Nouveau message privé", read: false },
    { id: 3, message: "Votre post a été liké", read: true },
]

export default function NotifList() {
    return (
        <div className="notif-list">
            {fakeNotifs.map(notif => (
                <NotifItem key={notif.id} notification={notif} />
            ))}
        </div>
    )
}