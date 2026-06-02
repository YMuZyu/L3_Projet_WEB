// Page d'un post : affiche le détail du post et la section de réponses
// Récupère le post et ses réponses depuis le serveur au chargement

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import PostDetail from "../components/posts/PostDetail.jsx"
import ReplySection from "../components/reply/ReplySection.jsx"
import '../styles/pages/PostPage.css'

export default function PostPage({ user, isConnected }) {

    const { postId } = useParams() // récupère l'id du post depuis l'URL
    const navigate = useNavigate()

    const [post, setPost] = useState(null)
    const [replies, setReplies] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        // Récupère le post
        const fetchPost = async () => {
            try {
                const response = await fetch(`http://localhost:10000/posts/${postId}`, {
                    credentials: 'include'
                })
                if (response.ok) {
                    const data = await response.json()
                    setPost(data)
                } else {
                    setError("Post introuvable")
                }
            } catch (err) {
                setError("Erreur serveur")
            } finally {
                setLoading(false)
            }
        }

        // Récupère les réponses du post
        const fetchReplies = async () => {
            try {
                const response = await fetch(`http://localhost:10000/posts/${postId}/replies`, {
                    credentials: 'include'
                })
                if (response.ok) {
                    const data = await response.json()
                    setReplies(data)
                }
            } catch (err) {
                console.error("Erreur lors du fetch des replies:", err)
            }
        }

        fetchPost()
        fetchReplies()
    }, [postId])

    // Pendant le chargement
    if (loading) return (
        <div className="post-page">
            <button className="back-btn" onClick={() => navigate('/')}>← Retour</button>
            <p>Chargement...</p>
        </div>
    )

    if (error) return (
        <div className="post-page">
            <button className="back-btn" onClick={() => navigate('/')}>← Retour</button>
            <p className="error">{error}</p>
        </div>
    )

    return (
        <div className="post-page">
            {/* Bouton retour vers l'accueil */}
            <button className="back-btn" onClick={() => navigate('/')}>← Retour</button>
            
            {/* Détail complet du post */}
            <PostDetail post={post} user={user} />

            {/* Section des réponses */}
            <ReplySection
                postId={postId}
                replies={replies}
                setReplies={setReplies}
                user={user}
                isConnected={isConnected}
            />
        </div>
    )
}