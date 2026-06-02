// Affiche la liste de toutes les cartes de posts
// Si aucun post ne correspond aux filtres, affiche un message

import PostCard from "./PostCard.jsx"
import '../../styles/post/PostList.css'

export default function PostList({ posts }) {

    if (!posts || posts.length === 0) {
        return <div className="pas-post">Aucun post trouvé</div>
    }

    return (
        <div className="post-list">
            {posts.map(post => (
                <PostCard key={post._id} post={post} />
            ))}
        </div>
    )
}