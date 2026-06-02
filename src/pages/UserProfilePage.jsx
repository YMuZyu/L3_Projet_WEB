import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthProvider.jsx"
import UserInfo from "../components/user/UserInfo.jsx"
import UserPosts from "../components/user/UserPosts.jsx"
import '../styles/pages/UserProfilePage.css'

export default function UserProfilePage({ user, isConnected }) {
    const { userId }   = useParams()
    const navigate     = useNavigate()

    const [profileUser, setProfileUser] = useState(null)
    const [userPosts,   setUserPosts]   = useState([])
    const [userReplies, setUserReplies] = useState([])
    const [tab,         setTab]         = useState('posts')
    const [loading,     setLoading]     = useState(true)
    const [error,       setError]       = useState("")

    const { updateAvatar } = useContext(AuthContext)
    const isOwnProfile = user && user._id === userId

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`/user/${userId}`)
                if (res.ok) setProfileUser(await res.json())
                else setError("Utilisateur introuvable")
            } catch { setError("Erreur serveur") }
            finally  { setLoading(false) }
        }

        const fetchPosts = async () => {
            try {
                const res = await fetch(`/posts/user/${userId}`)
                if (res.ok) setUserPosts(await res.json())
            } catch (err) { console.error(err) }
        }

        const fetchReplies = async () => {
            try {
                const res = await fetch(`/user/${userId}/replies`)
                if (res.ok) setUserReplies(await res.json())
            } catch (err) { console.error(err) }
        }

        fetchProfile()
        fetchPosts()
        fetchReplies()
    }, [userId])

    const handleAvatarUpdate = (newAvatarPath) => {
        setProfileUser(prev => ({ ...prev, avatar: newAvatarPath }))
        updateAvatar(newAvatarPath) // met à jour le header (UserButton) immédiatement
    }

    if (loading) return <p className="loading">Chargement...</p>
    if (error)   return <p className="error">{error}</p>

    return (
        <div className="profile-page">
            <div className="profile-header">
                <UserInfo
                    user={profileUser}
                    isOwnProfile={isOwnProfile}
                    onAvatarUpdate={handleAvatarUpdate}
                />
                <div className="profile-actions">
                    {isOwnProfile && (
                        <button
                            className="edit-profile-btn"
                            onClick={() => navigate(`/profile/${userId}/edit`)}
                        >
                            Modifier le profil
                        </button>
                    )}
                    {isConnected && !isOwnProfile && (
                        <button
                            className="message-profile-btn"
                            onClick={() => navigate(`/messages/${userId}`)}
                        >
                            ✉️ Envoyer un message
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
            </div>

            <div className="profile-content">
                {tab === 'posts' && (
                    <UserPosts
                        posts={userPosts}
                        onPostClick={(postId) => navigate(`/post/${postId}`)}
                    />
                )}
                {tab === 'replies' && (
                    <div className="user-replies">
                        {userReplies.length === 0
                            ? <p className="no-posts">Aucune réponse pour l'instant</p>
                            : userReplies.map(reply => (
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
                                    <span className="user-reply-date">
                                        {new Date(reply.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            ))
                        }
                    </div>
                )}
            </div>
        </div>
    )
}