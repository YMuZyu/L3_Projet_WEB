import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../styles/post/PostDetail.css'

export default function PostDetail({ post, user }) {
    const navigate = useNavigate()
    const [likes, setLikes] = useState(post.likes?.length ?? 0)
    const [liked, setLiked] = useState(user ? (post.likes || []).includes(user._id?.toString()) : false)

    if (!post) return null

    const handleLike = async () => {
        if (!user) { navigate('/login'); return }
        try {
            const res = await fetch(`http://localhost:10000/posts/${post._id}/like`, {
                method: 'POST',
                credentials: 'include'
            })
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
        <div className="post-detail">
            {post.imageUrl && (
                <div className="post-detail-image">
                    <img src={`http://localhost:10000${post.imageUrl}`} alt={post.title} />
                </div>
            )}

            <div className="post-detail-header">
                <span className="post-category">{post.category}</span>
                <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>

            <h1 className="post-detail-title">{post.title}</h1>

            <div className="post-detail-meta">
                <span
                    className="post-detail-author clickable"
                    onClick={() => navigate(`/profile/${post.userId}`)}
                >
                    ✍️ {post.author}
                </span>
                <button className={`like-btn${liked ? ' liked' : ''}`} onClick={handleLike}>
                    {liked ? '❤️' : '🤍'} {likes}
                </button>
            </div>

            <div className="post-detail-content">
                <p>{post.content}</p>
            </div>
        </div>
    )
}