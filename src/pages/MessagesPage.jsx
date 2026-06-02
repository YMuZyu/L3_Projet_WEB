import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import '../styles/pages/MessagesPage.css'

export default function MessagesPage({ user, isConnected }) {
    const { userId: partnerIdParam } = useParams()
    const navigate = useNavigate()

    const [conversations, setConversations] = useState([])
    const [messages,      setMessages]      = useState([])
    const [partner,       setPartner]       = useState(null)
    const [content,       setContent]       = useState('')
    const [sending,       setSending]       = useState(false)
    const bottomRef = useRef(null)

    // Charger la liste des conversations
    useEffect(() => {
        if (!isConnected) return
        const fetchConvs = async () => {
            try {
                const res = await fetch('/messages/conversations', { credentials: 'include' })
                if (res.ok) setConversations(await res.json())
            } catch {}
        }
        fetchConvs()
    }, [isConnected])

    // Charger la conversation ouverte
    useEffect(() => {
        if (!partnerIdParam || !isConnected) return

        const fetchPartner = async () => {
            try {
                const res = await fetch(`/user/${partnerIdParam}`)
                if (res.ok) setPartner(await res.json())
            } catch {}
        }

        const fetchMessages = async () => {
            try {
                const res = await fetch(`/messages/conversation/${partnerIdParam}`, { credentials: 'include' })
                if (res.ok) setMessages(await res.json())
            } catch {}
        }

        fetchPartner()
        fetchMessages()
    }, [partnerIdParam, isConnected])

    // Scroller vers le bas à chaque nouveau message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = async (e) => {
        e.preventDefault()
        if (!content.trim() || !partnerIdParam) return
        setSending(true)
        try {
            const res = await fetch('/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ toUserId: partnerIdParam, content: content.trim() })
            })
            if (res.ok) {
                const msg = await res.json()
                setMessages(prev => [...prev, msg])
                setContent('')
                // Mettre à jour la liste des conversations
                setConversations(prev => {
                    const exists = prev.find(c => c.partnerId === partnerIdParam)
                    if (exists) {
                        return prev.map(c => c.partnerId === partnerIdParam
                            ? { ...c, lastMessage: content.trim(), lastAt: new Date() }
                            : c
                        )
                    }
                    return [{ partnerId: partnerIdParam, partnerLogin: partner?.login, lastMessage: content.trim(), lastAt: new Date() }, ...prev]
                })
            }
        } catch {}
        setSending(false)
    }

    if (!isConnected) {
        return (
            <div className="messages-page">
                <p className="messages-login">Connectez-vous pour accéder aux messages.</p>
            </div>
        )
    }

    return (
        <div className="messages-page">
            {/* Panneau gauche : liste des conversations */}
            <aside className="conversations-panel">
                <h2 className="conv-title">Messages</h2>
                {conversations.length === 0
                    ? <p className="conv-empty">Aucune conversation</p>
                    : conversations.map(conv => (
                        <div
                            key={conv.partnerId}
                            className={`conv-item${conv.partnerId === partnerIdParam ? ' active' : ''}`}
                            onClick={() => navigate(`/messages/${conv.partnerId}`)}
                        >
                            <span className="conv-avatar">{conv.partnerLogin?.[0]?.toUpperCase() ?? '?'}</span>
                            <div className="conv-info">
                                <span className="conv-login">{conv.partnerLogin}</span>
                                <span className="conv-last">{conv.lastMessage}</span>
                            </div>
                        </div>
                    ))
                }
            </aside>

            {/* Panneau droit : conversation ouverte */}
            <section className="chat-panel">
                {!partnerIdParam ? (
                    <div className="chat-placeholder">
                        <p>Sélectionnez une conversation ou envoyez un message depuis un profil.</p>
                    </div>
                ) : (
                    <>
                        <div className="chat-header">
                            <button className="back-btn" onClick={() => navigate('/messages')}>←</button>
                            <span
                                className="chat-partner-name"
                                onClick={() => partner && navigate(`/profile/${partner._id}`)}
                            >
                                {partner?.login ?? '...'}
                            </span>
                        </div>

                        <div className="chat-messages">
                            {messages.length === 0
                                ? <p className="chat-empty">Aucun message. Dites bonjour !</p>
                                : messages.map(msg => {
                                    const isMine = msg.fromUserId === user?._id?.toString()
                                    return (
                                        <div key={msg._id} className={`chat-bubble${isMine ? ' mine' : ' theirs'}`}>
                                            <p className="bubble-content">{msg.content}</p>
                                            <span className="bubble-date">
                                                {new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    )
                                })
                            }
                            <div ref={bottomRef} />
                        </div>

                        <form className="chat-form" onSubmit={handleSend}>
                            <input
                                className="chat-input"
                                type="text"
                                placeholder="Votre message..."
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                disabled={sending}
                            />
                            <button className="chat-send-btn" type="submit" disabled={sending || !content.trim()}>
                                Envoyer
                            </button>
                        </form>
                    </>
                )}
            </section>
        </div>
    )
}
