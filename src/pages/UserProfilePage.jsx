import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthProvider.jsx"
import UserInfo from "../components/user/UserInfo.jsx"
import UserPosts from "../components/user/UserPosts.jsx"
import '../styles/pages/UserProfilePage.css'

const API = "http://localhost:10000"

export default function UserProfilePage({ user, isConnected }) {
    const { userId } = useParams()
    const navigate = useNavigate()

    const [profileUser, setProfileUser] = useState(null)
    const [userPosts, setUserPosts] = useState([])
    const [userReplies, setUserReplies] = useState([])
    const [tab, setTab] = useState('posts')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const { updateAvatar, updateLogin } = useContext(AuthContext)
    const isOwnProfile = user && user._id?.toString() === userId
    const isAdmin = user?.isAdmin

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${API}/user/${userId}`, { credentials: 'include' })
                if (res.ok) setProfileUser(await res.json())
                else setError("Utilisateur introuvable")
            } catch { setError("Erreur serveur") }
            finally  { setLoading(false) }
        }

        const fetchPosts = async () => {
            try {
                const res = await fetch(`${API}/posts/user/${userId}`, { credentials: 'include' })
                if (res.ok) setUserPosts(await res.json())
            } catch (err) { console.error(err) }
        }

        const fetchReplies = async () => {
            try {
                const res = await fetch(`${API}/user/${userId}/replies`, { credentials: 'include' })
                if (res.ok) setUserReplies(await res.json())
            } catch (err) { console.error(err) }
        }

        fetchProfile()
        fetchPosts()
        fetchReplies()
    }, [userId])

    const handleAvatarUpdate = (newAvatarPath) => {
        setProfileUser(prev => ({ ...prev, avatar: newAvatarPath }))
        updateAvatar(newAvatarPath)
    }

    const handleLoginUpdate = (newLogin) => {
        setProfileUser(prev => ({ ...prev, login: newLogin }))
        updateLogin(newLogin)
    }

    // Admin: supprimer un post de force
    const handleAdminDeletePost = async (postId) => {
        if (!confirm('Supprimer ce post par force ?')) return
        try {
            const res = await fetch(`${API}/admin/posts/${postId}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            if (res.ok) setUserPosts(prev => prev.filter(p => p._id?.toString() !== postId))
        } catch (err) { console.error(err) }
    }

    // Admin: révoquer / réactiver un membre
    const handleAdminRevoke = async () => {
        const newState = !profileUser.isValidated
        const msg = newState ? 'Réactiver ce membre ?' : 'Révoquer ce membre ? Il ne pourra plus se connecter.'
        if (!confirm(msg)) return
        try {
            const res = await fetch(`${API}/admin/users/${userId}/validate`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ isValidated: newState })
            })
            if (res.ok) setProfileUser(prev => ({ ...prev, isValidated: newState }))
        } catch (err) { console.error(err) }
    }

    // Admin: supprimer une réponse de force
    const handleAdminDeleteReply = async (replyId) => {
        if (!confirm('Supprimer cette réponse par force ?')) return
        try {
            const res = await fetch(`${API}/admin/replies/${replyId}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            if (res.ok) setUserReplies(prev => prev.filter(r => r._id?.toString() !== replyId))
        } catch (err) { console.error(err) }
    }

    if (loading) return <p className="loading">Chargement...</p>
    if (error)   return <p className="error">{error}</p>

    return (
        <div className="profile-page">
            <button className="back-btn" onClick={() => navigate(-1)}>
                ← Retour
            </button>

            <div className="profile-header">
                <UserInfo
                    user={profileUser}
                    isOwnProfile={isOwnProfile}
                    onAvatarUpdate={handleAvatarUpdate}
                    onLoginUpdate={handleLoginUpdate}
                    postsCount={userPosts.length}
                    repliesCount={userReplies.length}
                />
                <div className="profile-actions">
                    {isConnected && !isOwnProfile && (
                        <button
                            className="message-profile-btn"
                            onClick={() => navigate(`/messages/${userId}`)}
                        >
                            <img src="/message.png" alt="message" style={{ width: '1em', verticalAlign: 'middle' }} /> Envoyer un message
                        </button>
                    )}
                    {isAdmin && !isOwnProfile && (
                        <button
                            className={`admin-revoke-btn${profileUser?.isValidated === false ? ' revoked' : ''}`}
                            onClick={handleAdminRevoke}
                        >
                            {profileUser?.isValidated === false ? '✅ Réactiver membre' : '🚫 Révoquer membre'}
                        </button>
                    )}
                </div>
            </div>

            <div className="profile-tabs">
                <button
                    className={tab === 'posts' ? 'active' : ''}
                    onClick={() => setTab('posts')}
                >
                    📝 Posts ({userPosts.length})
                </button>
                <button
                    className={tab === 'replies' ? 'active' : ''}
                    onClick={() => setTab('replies')}
                >
                    💬 Réponses ({userReplies.length})
                </button>
                {isOwnProfile && (
                    <button
                        className={tab === 'messages' ? 'active' : ''}
                        onClick={() => navigate('/messages')}
                    >
                        <img src="/message.png" alt="message" style={{ width: '1em', verticalAlign: 'middle' }} /> Messages
                    </button>
                )}
            </div>

            <div className="profile-content">
                {tab === 'posts' && (
                    <div className="user-posts">
                        {userPosts.length === 0
                            ? <p className="no-posts">Aucun post pour l'instant</p>
                            : <>
                                {/* 5 posts les plus récents (triés desc par le backend) */}
                                {userPosts.slice(0, 5).map(post => (
                                    <div
                                        key={post._id}
                                        className="user-post-item"
                                        onClick={() => navigate(`/post/${post._id}`)}
                                    >
                                        <div className="user-post-header">
                                            <span className="post-category">{post.category}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
                                                {isAdmin && !isOwnProfile && (
                                                    <button
                                                        className="admin-delete-btn"
                                                        onClick={e => { e.stopPropagation(); handleAdminDeletePost(post._id) }}
                                                        title="Supprimer (admin)"
                                                    >
                                                        🗑️ Admin
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <h4 className="user-post-title">{post.title}</h4>
                                        <p className="user-post-preview">
                                            {post.content?.length > 120
                                                ? post.content.substring(0, 120) + '...'
                                                : post.content}
                                        </p>
                                    </div>
                                ))}
                                {/* Lien vers l'historique si plus de 5 posts */}
                                {isOwnProfile && userPosts.length > 5 && (
                                    <button className="profile-see-more-btn" onClick={() => navigate('/history')}>
                                        Voir tout l'historique ({userPosts.length} posts) →
                                    </button>
                                )}
                                {!isOwnProfile && userPosts.length > 5 && (
                                    <p className="profile-more-hint">
                                        … et {userPosts.length - 5} post{userPosts.length - 5 > 1 ? 's' : ''} supplémentaire{userPosts.length - 5 > 1 ? 's' : ''}
                                    </p>
                                )}
                            </>
                        }
                    </div>
                )}
                {tab === 'replies' && (
                    <div className="user-replies">
                        {userReplies.length === 0
                            ? <p className="no-posts">Aucune réponse pour l'instant</p>
                            : <>
                                {/* 5 réponses les plus récentes */}
                                {userReplies.slice(0, 5).map(reply => (
                                    <div
                                        key={reply._id}
                                        className="user-reply-item"
                                        onClick={() => navigate(`/post/${reply.postId}`)}
                                    >
                                        <p className="user-reply-content">
                                            {reply.content?.length > 120
                                                ? reply.content.substring(0, 120) + '...'
                                                : reply.content
                                            }
                                        </p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span className="user-reply-date">
                                                {new Date(reply.createdAt).toLocaleDateString()}
                                            </span>
                                            {isAdmin && !isOwnProfile && (
                                                <button
                                                    className="admin-delete-btn"
                                                    onClick={e => { e.stopPropagation(); handleAdminDeleteReply(reply._id) }}
                                                    title="Supprimer (admin)"
                                                >
                                                    🗑️ Admin
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {isOwnProfile && userReplies.length > 5 && (
                                    <button className="profile-see-more-btn" onClick={() => navigate('/history')}>
                                        Voir tout l'historique ({userReplies.length} réponses) →
                                    </button>
                                )}
                                {!isOwnProfile && userReplies.length > 5 && (
                                    <p className="profile-more-hint">
                                        … et {userReplies.length - 5} réponse{userReplies.length - 5 > 1 ? 's' : ''} supplémentaire{userReplies.length - 5 > 1 ? 's' : ''}
                                    </p>
                                )}
                            </>
                        }
                    </div>
                )}
            </div>
        </div>
    )
}
