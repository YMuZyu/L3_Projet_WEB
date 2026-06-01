import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../styles/reply/ReplyItem.css'

export default function ReplyItem({ reply, postId, user }) {
    const navigate = useNavigate()
    const [likes, setLikes] = useState(reply.likes?.length ?? 0)
    const [liked, setLiked] = useState(user ? (reply.likes || []).includes(user._id?.toString()) : false)

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
            }
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="reply-item">
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
                    <button
                        className={`like-btn small${liked ? ' liked' : ''}`}
                        onClick={handleLike}
                    >
                        {liked ? '❤️' : '🤍'} {likes}
                    </button>
                </div>
            </div>
            <p className="reply-content">{reply.content}</p>
        </div>
    )
}