import { useState, useEffect } from 'react'
import '../../styles/nav/UserButton.css'

export default function UserButton({ user, onClick }) {
    const [imgFailed, setImgFailed] = useState(false)

    // Réessaie de charger l'image quand l'avatar change
    useEffect(() => { setImgFailed(false) }, [user?.avatar])

    return (
        <button className="header-button" onClick={onClick}>
            {user?.avatar && !imgFailed
                ? <img
                    src={user.avatar}
                    alt={user.login}
                    className="user-btn-avatar"
                    onError={() => setImgFailed(true)}
                  />
                : <span className="user-btn-initial">{user?.login?.[0]?.toUpperCase() ?? '👤'}</span>
            }
        </button>
    )
}
