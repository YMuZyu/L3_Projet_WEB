import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import '../styles/pages/HistoryPage.css'

const API = "http://localhost:10000"

export default function HistoryPage({ user, isConnected }) {
    const navigate = useNavigate()

    const [posts,    setPosts]    = useState([])
    const [replies,  setReplies]  = useState([])
    const [messages, setMessages] = useState([])
    const [loading,  setLoading]  = useState(true)

    // Filtres
    const [search,    setSearch]    = useState("")
    const [category,  setCategory]  = useState("")
    const [date,      setDate]      = useState("")
    const [recipient, setRecipient] = useState("")

    const hasFilter = !!(search || category || date || recipient)

    const fetchHistory = useCallback(async () => {
        if (!isConnected) return
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (search)    params.set('search',    search)
            if (category)  params.set('category',  category)
            if (date)      params.set('date',       date)
            if (recipient) params.set('recipient',  recipient)

            const res = await fetch(`${API}/user/me/history?${params}`, { credentials: 'include' })
            if (res.ok) {
                const data = await res.json()
                setPosts(data.posts || [])
                setReplies(data.replies || [])
                setMessages(data.messages || [])
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [isConnected, search, category, date, recipient])

    useEffect(() => {
        fetchHistory()
    }, [fetchHistory])

    if (!isConnected) {
        return (
            <div className="history-page">
                <p className="history-empty">Connectez-vous pour voir votre historique.</p>
            </div>
        )
    }

    return (
        <div className="history-page">
            <div className="history-header">
                <button className="back-btn" onClick={() => navigate(-1)}>← Retour</button>
                <h1>📋 Mon historique</h1>
                <p className="history-hint">
                    {hasFilter
                        ? "Résultats filtrés — triés du plus récent au plus ancien."
                        : "Tout votre historique, du plus récent au plus ancien. Utilisez les filtres pour préciser."}
                </p>
            </div>

            {/* Barre de filtres */}
            <div className="history-filters">
                <input
                    className="history-filter-input"
                    type="text"
                    placeholder="🔍 Mot-clé (titre, contenu)..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <input
                    className="history-filter-input"
                    type="text"
                    placeholder="🏷️ Thème / catégorie..."
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                />
                <input
                    className="history-filter-input"
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    title="Filtrer par date"
                />
                <input
                    className="history-filter-input"
                    type="text"
                    placeholder="👤 Destinataire (messages)..."
                    value={recipient}
                    onChange={e => setRecipient(e.target.value)}
                />
                {hasFilter && (
                    <button
                        className="history-clear-btn"
                        onClick={() => { setSearch(""); setCategory(""); setDate(""); setRecipient("") }}
                    >
                        ✕ Effacer
                    </button>
                )}
            </div>

            {loading ? (
                <p className="history-empty">Chargement...</p>
            ) : (
                <div className="history-sections">

                    {/* Posts */}
                    <section className="history-section">
                        <h2>📝 Posts ({posts.length})</h2>
                        {posts.length === 0
                            ? <p className="history-empty">Aucun post trouvé</p>
                            : posts.map(post => (
                                <div
                                    key={post._id}
                                    className="history-item"
                                    onClick={() => navigate(`/post/${post._id}`)}
                                >
                                    <div className="history-item-header">
                                        <span className="history-item-badge">{post.category}</span>
                                        <span className="history-item-date">
                                            {new Date(post.createdAt).toLocaleDateString('fr-FR', {
                                                day: '2-digit', month: '2-digit', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                    <h3 className="history-item-title">{post.title}</h3>
                                    <p className="history-item-preview">
                                        {post.content?.length > 150
                                            ? post.content.substring(0, 150) + '...'
                                            : post.content}
                                    </p>
                                </div>
                            ))
                        }
                    </section>

                    {/* Réponses */}
                    <section className="history-section">
                        <h2>💬 Réponses ({replies.length})</h2>
                        {replies.length === 0
                            ? <p className="history-empty">Aucune réponse trouvée</p>
                            : replies.map(reply => (
                                <div
                                    key={reply._id}
                                    className="history-item"
                                    onClick={() => navigate(`/post/${reply.postId}`)}
                                >
                                    <div className="history-item-header">
                                        <span className="history-item-date">
                                            {new Date(reply.createdAt).toLocaleDateString('fr-FR', {
                                                day: '2-digit', month: '2-digit', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                    <p className="history-item-preview">
                                        {reply.content?.length > 200
                                            ? reply.content.substring(0, 200) + '...'
                                            : reply.content}
                                    </p>
                                    <span className="history-item-meta">→ Voir le post</span>
                                </div>
                            ))
                        }
                    </section>

                    {/* Messages */}
                    <section className="history-section">
                        <h2>✉️ Messages envoyés ({messages.length})</h2>
                        {messages.length === 0
                            ? <p className="history-empty">Aucun message trouvé</p>
                            : messages.map(msg => (
                                <div
                                    key={msg._id}
                                    className="history-item"
                                    onClick={() => navigate(`/messages/${msg.toUserId}`)}
                                >
                                    <div className="history-item-header">
                                        <span className="history-item-badge">À : {msg.toUserLogin}</span>
                                        <span className="history-item-date">
                                            {new Date(msg.createdAt).toLocaleDateString('fr-FR', {
                                                day: '2-digit', month: '2-digit', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                    <p className="history-item-preview">
                                        {msg.content?.length > 200
                                            ? msg.content.substring(0, 200) + '...'
                                            : msg.content}
                                    </p>
                                </div>
                            ))
                        }
                    </section>

                </div>
            )}
        </div>
    )
}
