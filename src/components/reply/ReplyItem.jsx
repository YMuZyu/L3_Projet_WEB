import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../styles/reply/ReplyItem.css'

export default function ReplyItem({ reply, postId, user, onDelete, onReply, allReplies = [] }) {
    const navigate = useNavigate()
    const [likes, setLikes] = useState(reply.likes?.length ?? 0)
    const [liked, setLiked] = useState(user ? (reply.likes || []).includes(user._id?.toString()) : false)
    const [dislikes, setDislikes] = useState(reply.dislikes?.length ?? 0)
    const [disliked, setDisliked] = useState(user ? (reply.dislikes || []).includes(user._id?.toString()) : false)
    const [deleting, setDeleting] = useState(false)
    const [likeHovered, setLikeHovered] = useState(false)

    const canDelete = user && (user._id?.toString() === reply.userId || user.isAdmin)

    // Retrouve la réponse parente dans la liste complète des réponses
    const parentReply = reply.parentReplyId
        ? allReplies.find(r => r._id?.toString() === reply.parentReplyId?.toString())
        : null

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
            {/* Aperçu de la réponse citée */}
            {parentReply && (
                <div className="reply-quoted">
                    <span
                        className="reply-quoted-author"
                        onClick={() => navigate(`/profile/${parentReply.userId}`)}
                    >
                        ↩ {parentReply.author}
                    </span>
                    <p className="reply-quoted-content">
                        {parentReply.content?.length > 100
                            ? parentReply.content.substring(0, 100) + '...'
                            : parentReply.content}
                    </p>
                </div>
            )}

            <div className="reply-header">
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

                    {/* Bouton répondre (visible si connecté) */}
                    {user && (
                        <button
                            className="reply-to-btn"
                            onClick={() => onReply?.(reply)}
                            title="Répondre"
                        >
                            ↩
                        </button>
                    )}

                    <button
                        className={`like-btn small${liked ? ' liked' : ''}`}
                        onClick={handleLike}
                        onMouseEnter={() => setLikeHovered(true)}
                        onMouseLeave={() => setLikeHovered(false)}
                        title="J'aime"
                    >
                        <img
                            src={liked ? '/pikura-heart-20751_heart_like.gif' : likeHovered ? '/heart_souris_dessus.png' : '/heart_pas_encore_like.png'}
                            alt="like"
                            style={{ width: '1em', verticalAlign: 'middle' }}
                        /> {likes}
                    </button>
                    <button
                        className={`like-btn small dislike-btn${disliked ? ' disliked' : ''}`}
                        onClick={handleDislike}
                        title="Je n'aime pas"
                    >
                        <img src="/image dislike.png" alt="dislike" style={{ width: '1em', verticalAlign: 'middle' }} /> {dislikes}
                    </button>

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
