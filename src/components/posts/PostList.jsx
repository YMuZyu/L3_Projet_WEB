import PostCard from "./PostCard.jsx"
import '../../styles/post/PostList.css'

export default function PostList({ posts }) {

    if (posts.length === 0) {
        return <div className="pas-post">Aucun post trouvé</div>
    }

    return (
        <div className="post-list">
            {posts.map(post => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    )
}