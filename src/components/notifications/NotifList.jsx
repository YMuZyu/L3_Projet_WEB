// Liste des notifications avec filtres par type et bouton "tout marquer comme lu"

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NotifItem from './NotifItem.jsx'
import '../../styles/notifications/NotifDropdown.css'
import '../../styles/notifications/NotifItem.css'

const TABS = [
    { key: 'all', label: 'Tout' },
    { key: 'reply_post', label: '💬 Réponses post' },
    { key: 'message', label: '✉️ Messages' },
    { key: 'like_post', label: '❤️ Likes' },
]

export default function NotifList({ onRead }) {
    const [notifs, setNotifs] = useState([])
    const [filter, setFilter] = useState('all')
    const navigate = useNavigate()

    // Charge les notifications au montage du composant
    useEffect(() => {
        const fetchNotifs = async () => {
            try {
                const res = await fetch('http://localhost:10000/notifications', {
                    credentials: 'include'
                })
                if (res.ok) setNotifs(await res.json())
            } catch {}
        }
        fetchNotifs()
    }, [])

    // Marque une notification comme lue
    const markOneRead = async (notifId) => {
        try {
            await fetch(`http://localhost:10000/notifications/${notifId}/read`, {
                method: 'PATCH',
                credentials: 'include'
            })
        } catch {}
        setNotifs(prev => prev.map(n => n._id === notifId ? { ...n, read: true } : n))
        const stillUnread = notifs.filter(n => n._id !== notifId && !n.read).length
        if (stillUnread === 0) onRead?.()
    }

    // Marque toutes les notifications comme lues
    const markAllRead = async () => {
        try {
            await fetch('http://localhost:10000/notifications/read-all', {
                method: 'PATCH',
                credentials: 'include'
            })
        } catch {}
        setNotifs(prev => prev.map(n => ({ ...n, read: true })))
        onRead?.()
    }

    // Clique sur une notification → marque comme lue + redirige
    const handleClick = async (notif) => {
        if (!notif.read) await markOneRead(notif._id)
        if (notif.type === 'reply_post' || notif.type === 'like_post') {
            navigate(`/post/${notif.postId}`)
        } else if (notif.type === 'reply_reply' || notif.type === 'like_reply') {
            navigate(`/post/${notif.postId}`)
        } else if (notif.type === 'message') {
            navigate(`/messages/${notif.fromUserId}`)
        }
    }

    const filtered = filter === 'all'
        ? notifs
        : notifs.filter(n => n.type === filter)

    const hasUnread = notifs.some(n => !n.read)

    return (
        <div className="notif-list-wrapper">

            {/* Filtres par type */}
            <div className="notif-tabs">
                {TABS.map(tab => (
                    <button
                        key={tab.key}
                        className={`notif-tab${filter === tab.key ? ' active' : ''}`}
                        onClick={() => setFilter(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Bouton tout marquer comme lu */}
            {hasUnread && (
                <button className="notif-read-all-btn" onClick={markAllRead}>
                    ✓ Tout marquer comme lu
                </button>
            )}

            <div className="notif-list">
                {filtered.length === 0
                    ? <p className="notif-empty-state">Aucune notification</p>
                    : filtered.map(n => (
                        <NotifItem key={n._id} notification={n} onClick={() => handleClick(n)} />
                    ))
                }
            </div>
        </div>
    )
}
