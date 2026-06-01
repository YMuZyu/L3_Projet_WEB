import { useNavigate } from "react-router-dom"
import '../../styles/post/PostCard.css'

export default function PostCard({ post }) {
    const navigate = useNavigate()

    return (
        <article
            className={`post-card${post.imageUrl ? ' has-image' : ''}`}
            onClick={() => navigate(`/post/${post._id}`)}
        >
            {post.imageUrl && (
                <div className="post-card-image">
                    <img src={`http://localhost:10000${post.imageUrl}`} alt={post.title} />
                </div>
            )}
            <div className="post-card-header">
                <span className="post-category">{post.category}</span>
                <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            <h3 className="post-title">{post.title}</h3>
            <p className="post-preview">
                {post.content.length > 150
                    ? post.content.substring(0, 150) + "..."
                    : post.content
                }
            </p>
            <div className="post-card-footer">
                <span>✍️ {post.author}</span>
                <span>💬 {post.comments ?? 0} commentaires</span>
            </div>
        </article>
    )
}
