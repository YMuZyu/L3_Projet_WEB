import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../styles/post/PostDetail.css'

export default function PostDetail({ post, user }) {
    const navigate = useNavigate()
    const [likes, setLikes] = useState(post.likes?.length ?? 0)
    const [liked, setLiked] = useState(user ? (post.likes || []).includes(user._id?.toString()) : false)
    const [dislikes, setDislikes] = useState(post.dislikes?.length ?? 0)
    const [disliked, setDisliked] = useState(user ? (post.dislikes || []).includes(user._id?.toString()) : false)

    if (!post) return null

    const handleLike = async () => {
        if (!user) { navigate('/login'); return }
        try {
            const res = await fetch(`/posts/${post._id}/like`, {
                method: 'POST',
                credentials: 'include'
            })
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

    const handleDislike = async () => {
        if (!user) { navigate('/login'); return }
        try {
            const res = await fetch(`/posts/${post._id}/dislike`, {
                method: 'POST',
                credentials: 'include'
            })
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

    return (
        <div className="post-detail">
            {post.imageUrl && (
                <div className="post-detail-image">
                    <img src={`${post.imageUrl}`} alt={post.title} />
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
                <div className="post-vote-btns">
                    <button className={`like-btn${liked ? ' liked' : ''}`} onClick={handleLike}>
                        {liked ? '❤️' : '🤍'} {likes}
                    </button>
                    <button className={`like-btn dislike-btn${disliked ? ' disliked' : ''}`} onClick={handleDislike}>
                        {disliked ? '👎' : '👍🏻'} {dislikes}
                    </button>
                </div>
            </div>

            <div className="post-detail-content">
                <p>{post.content}</p>
            </div>
        </div>
    )
}
