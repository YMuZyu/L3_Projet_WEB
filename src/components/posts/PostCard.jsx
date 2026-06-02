// Carte d'aperçu d'un post : image, catégorie, titre, extrait du contenu, auteur et stats
// Clique sur la carte : page du post
// clique sur l'auteur : page profil de l'auteur

import { useNavigate } from "react-router-dom"
import '../../styles/post/PostCard.css'

export default function PostCard({ post, user }) {
    const navigate = useNavigate()

    const goToPost = () => navigate(`/post/${post._id}`)
    const goToProfile = (e) => { 
        e.stopPropagation(); // empêche la navigation vers le post
        navigate(`/profile/${post.userId}`) 
    }

    return (
        <article
            className={`post-card${post.imageUrl ? ' has-image' : ''}`}
            onClick={goToPost}
        >
            {/* Image du post si elle existe */}
            {post.imageUrl && (
                <div className="post-card-image">
                    {/* image visible depuis n'importe quel PC */}
                    <img src={post.imageUrl} alt={post.title} />
                </div>
            )}

            <div className="post-card-header">
                <span className="post-category">{post.category}</span>
                <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>

            <h3 className="post-title">{post.title}</h3>

            {/* Aperçu du contenu tronqué à 150 caractères */}
            <p className="post-preview">
                {post.content?.length > 150
                    ? post.content.substring(0, 150) + "..."
                    : post.content
                }
            </p>

            <div className="post-card-footer">

                {/* Badge auteur : avatar ou initiale */}
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

                {/* Nom de l'auteur cliquable */}
                <span className="post-author-name" onClick={goToProfile}>
                    {post.author}
                </span>

                {/* likes, dislikes, commentaires */}
                <span className="post-footer-right">
                    <img
                        src={user && (post.likes || []).includes(user._id?.toString()) ? '/pikura-heart-20751_heart_like.gif' : '/heart_pas_encore_like.png'}
                        alt="like"
                        style={{ width: '1.2em', verticalAlign: 'middle' }}
                    /> {post.likes?.length ?? 0}
                    <img src="/image dislike.png" alt="dislike" style={{ width: '1.4em', verticalAlign: 'middle' }} /> {post.dislikes?.length ?? 0}
                    <img src="/messager.png" alt="dislike" style={{ width: '0.9em', verticalAlign: 'middle' }} /> {post.comments ?? 0}
                </span>
            </div>
        </article>
    )
}