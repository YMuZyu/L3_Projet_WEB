// Affiche un commentaire avec likes/dislikes et bouton supprimer
// L'auteur peut supprimer son propre commentaire

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../styles/reply/ReplyItem.css'

export default function ReplyItem({ reply, postId, user, onDelete }) {
    const navigate = useNavigate()
    const [likes, setLikes] = useState(reply.likes?.length ?? 0)
    const [liked, setLiked] = useState(user ? (reply.likes || []).includes(user._id?.toString()) : false)
    const [dislikes, setDislikes] = useState(reply.dislikes?.length ?? 0)
    const [disliked, setDisliked] = useState(user ? (reply.dislikes || []).includes(user._id?.toString()) : false)
    const [deleting, setDeleting] = useState(false)

    // Seul l'auteur ou admin peuvent supprimer un commentaire
    const canDelete = user && (user._id?.toString() === reply.userId || user.isAdmin)

    const handleLike = async (e) => {
        e.stopPropagation()
        if (!user) { navigate('/login'); return }
        try {
            const res = await fetch(
                `http://localhost:10000/posts/${postId}/replies/${reply._id}/like`,
                { method: 'POST', credentials: 'include' }
            )
            if (res.ok) {
                const data = await res.json()
                setLikes(data.likes)
                setLiked(data.liked)
                setDislikes(data.dislikes)
                setDisliked(data.disliked)
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleDislike = async (e) => {
        e.stopPropagation()
        if (!user) { navigate('/login'); return }
        try {
            const res = await fetch(
                `http://localhost:10000/posts/${postId}/replies/${reply._id}/dislike`,
                { method: 'POST', credentials: 'include' }
            )
            if (res.ok) {
                const data = await res.json()
                setDislikes(data.dislikes)
                setDisliked(data.disliked)
                setLikes(data.likes)
                setLiked(data.liked)
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleDelete = async (e) => {
        e.stopPropagation()
        if (!confirm('Supprimer cette réponse ?')) return
        setDeleting(true)
        try {
            const res = await fetch(
                `http://localhost:10000/posts/${postId}/replies/${reply._id}`,
                { method: 'DELETE', credentials: 'include' }
            )
            if (res.ok) {
                onDelete?.(reply._id)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className="reply-item">
            <div className="reply-header">

                {/* Auteur cliquable vers son profil */}
                <span
                    className="reply-author"
                    onClick={() => navigate(`/profile/${reply.userId}`)}
                    style={{ cursor: 'pointer' }}
                >
                    ✍️ {reply.author}
                </span>

                <div className="reply-header-right">
                    <span className="reply-date">
                        {new Date(reply.createdAt).toLocaleDateString()}
                    </span>

                    {/* Boutons like/dislike */}
                    <button
                        className={`like-btn small${liked ? ' liked' : ''}`}
                        onClick={handleLike}
                        title="J'aime"
                    >
                        ❤️ {likes}
                    </button>
                    <button
                        className={`like-btn small dislike-btn${disliked ? ' disliked' : ''}`}
                        onClick={handleDislike}
                        title="Je n'aime pas"
                    >
                        👎 {dislikes}
                    </button>

                    {/* Bouton supprimer visible seulement pour l'auteur ou l'admin */}
                    {canDelete && (
                        <button
                            className="delete-reply-btn"
                            onClick={handleDelete}
                            disabled={deleting}
                            title="Supprimer"
                        >
                            🗑️
                        </button>
                    )}
                </div>
            </div>
            
            <p className="reply-content">{reply.content}</p>
        </div>
    )
}