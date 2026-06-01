import { useNavigate } from "react-router-dom"
import '../../styles/post/PostCard.css'

export default function PostCard({ post }) {
    const navigate = useNavigate()

    const goToPost    = ()  => navigate(`/post/${post._id}`)
    const goToProfile = (e) => { e.stopPropagation(); navigate(`/profile/${post.userId}`) }

    return (
        <article
            className={`post-card${post.imageUrl ? ' has-image' : ''}`}
            onClick={goToPost}
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
                {post.content?.length > 150
                    ? post.content.substring(0, 150) + "..."
                    : post.content
                }
            </p>

            <div className="post-card-footer">
                <span
                    className="post-author-badge"
                    onClick={goToProfile}
                    title={`Voir le profil de ${post.author}`}
                >
                    {post.authorAvatar
                        ? <img src={post.authorAvatar} alt={post.author} className="author-avatar-img" />
                        : post.author?.[0]?.toUpperCase() ?? '?'
                    }
                </span>
                <span className="post-author-name" onClick={goToProfile}>
                    {post.author}
                </span>
                <span className="post-footer-right">
                    ❤️ {post.likes?.length ?? 0}
                    &nbsp;
                    👎 {post.dislikes?.length ?? 0}
                    &nbsp;&nbsp;
                    💬 {post.comments ?? 0}
                </span>
            </div>
        </article>
    )
}