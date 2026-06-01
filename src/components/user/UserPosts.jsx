import { useNavigate } from "react-router-dom"
import '../../styles/user/UserInfo.css'

export default function UserPosts({ posts, onPostClick }) {

    const navigate = useNavigate()

    if (!posts || posts.length === 0) {
        return <p className="no-posts">Aucun post pour l'instant</p>
    }

    return (
        <div className="user-posts">
            {posts.map(post => (
                <div
                    key={post._id}
                    className="user-post-item"
                    onClick={() => onPostClick ? onPostClick(post._id) : navigate(`/post/${post._id}`)}
                >
                    <div className="user-post-header">
                        <span className="post-category">{post.category}</span>
                        <span className="post-date">
                            {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <h4 className="user-post-title">{post.title}</h4>
                    <p className="user-post-preview">
                        {post.content?.length > 100
                            ? post.content.substring(0, 100) + "..."
                            : post.content
                        }
                    </p>
                </div>
            ))}
        </div>
    )
}