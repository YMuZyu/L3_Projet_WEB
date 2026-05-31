import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import PostDetail from "../components/posts/PostDetail.jsx"
import ReplySection from "../components/reply/ReplySection.jsx"
import '../styles/pages/PostPage.css'

export default function PostPage({ user, isConnected }) {

    const { postId } = useParams()
    const [post, setPost] = useState(null)
    const [replies, setReplies] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`http://localhost:10000/posts/${postId}`)
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

        const fetchReplies = async () => {
            try {
                const response = await fetch(`http://localhost:10000/posts/${postId}/replies`)
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

    if (loading) return <p className="loading">Chargement...</p>
    if (error) return <p className="error">{error}</p>

    return (
        <div className="post-page">
            <PostDetail post={post} />
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