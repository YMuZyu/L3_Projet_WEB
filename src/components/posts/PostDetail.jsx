import '../../styles/post/PostDetail.css'

export default function PostDetail({ post }) {

    if (!post) return null

    return (
        <div className="post-detail">
            <div className="post-detail-header">
                <span className="post-category">{post.domain}</span>
                <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            <h1 className="post-detail-title">{post.title}</h1>
            <p className="post-detail-author">✍️ {post.author}</p>
            <div className="post-detail-content">
                <p>{post.content}</p>
            </div>
        </div>
    )
}