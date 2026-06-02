// Affiche le détail complet d'un post : image, titre, contenu, likes/dislikes
// L'auteur et les admins peuvent supprimer le post

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../styles/post/PostDetail.css'

// Appel API pour supprimer un post
async function deletePost(postId) {
    const res = await fetch(`http://localhost:10000/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include'
    })
    return res.ok
}

export default function PostDetail({ post, user }) {
    const navigate = useNavigate()

    // États locaux pour les likes/dislikes (mis à jour sans recharger la page)
    const [likes, setLikes] = useState(post.likes?.length ?? 0)
    const [liked, setLiked] = useState(user ? (post.likes || []).includes(user._id?.toString()) : false)
    const [dislikes, setDislikes] = useState(post.dislikes?.length ?? 0)
    const [disliked, setDisliked] = useState(user ? (post.dislikes || []).includes(user._id?.toString()) : false)
    const [likeHovered, setLikeHovered] = useState(false)

    if (!post) return null

    // Seul l'auteur ou un admin peut supprimer le post
    const isAuthor = user && user._id?.toString() === post.userId?.toString()
    const canDelete = isAuthor || user?.isAdmin

    const handleDelete = async () => {
        if (!confirm('Supprimer ce post ?')) return
        const ok = await deletePost(post._id)
        if (ok) navigate('/')
    }

    // Like : si déjà liké on retire, sinon on ajoute
    const handleLike = async () => {
        if (!user) { navigate('/login'); return }
        try {
            const res = await await fetch(`http://localhost:10000/posts/${post._id}/like`, {
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

    // Dislike : même logique que le like
    const handleDislike = async () => {
        if (!user) { navigate('/login'); return }
        try {
            const res = await fetch(`http://localhost:10000/posts/${post._id}/dislike`, {
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

            {/* Image du post si elle existe */}
            {post.imageUrl && (
                <div className="post-detail-image">
                    <img src={`${post.imageUrl}`} alt={post.title} />
                </div>
            )}

            {/* Catégorie + date */}
            <div className="post-detail-header">
                <span className="post-category">{post.category}</span>
                <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            
            <h1 className="post-detail-title">{post.title}</h1>
            
            {/* Auteur + bouton supprimer + likes */}
            <div className="post-detail-meta">
                <span
                    className="post-detail-author clickable"
                    onClick={() => navigate(`/profile/${post.userId}`)}
                >
                    ✍️ {post.author}
                </span>

                {canDelete && (
                <button className="delete-post-btn" onClick={handleDelete}>
                    🗑️ Supprimer
                </button>
            )}

            <div className="post-vote-btns">
                    <button
                        className={`like-btn${liked ? ' liked' : ''}`}
                        onClick={handleLike}
                        onMouseEnter={() => setLikeHovered(true)}
                        onMouseLeave={() => setLikeHovered(false)}
                    >
                        <img
                            src={liked ? '/pikura-heart-20751_heart_like.gif' : likeHovered ? '/heart_souris_dessus.png' : '/heart_pas_encore_like.png'}
                            alt="like"
                            style={{ width: '1.1em', verticalAlign: 'middle' }}
                        /> {likes}
                    </button>
                    <button className={`like-btn dislike-btn${disliked ? ' disliked' : ''}`} onClick={handleDislike}>
                        <img src="/image dislike.png" alt="dislike" style={{ width: '1.1em', verticalAlign: 'middle' }} /> {dislikes}
                    </button>
                </div>
            </div>

            {/* Contenu du post */}
            <div className="post-detail-content">
                <p>{post.content}</p>
            </div>
        </div>
    )
}
