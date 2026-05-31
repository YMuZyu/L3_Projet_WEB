import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import UserInfo from "../components/user/UserInfo.jsx"
import UserPosts from "../components/user/UserPosts.jsx"
import '../styles/pages/UserProfilePage.css'

export default function UserProfilePage({ user, isConnected }) {

    const { userId } = useParams()
    const navigate = useNavigate()

    const [profileUser, setProfileUser] = useState(null)
    const [userPosts, setUserPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const isOwnProfile = user && user.id === userId

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`http://localhost:10000/user/${userId}`)
                if (response.ok) {
                    const data = await response.json()
                    setProfileUser(data)
                } else {
                    setError("Utilisateur introuvable")
                }
            } catch (err) {
                setError("Erreur serveur")
            } finally {
                setLoading(false)
            }
        }

        const fetchUserPosts = async () => {
            try {
                const response = await fetch(`http://localhost:10000/posts/user/${userId}`)
                if (response.ok) {
                    const data = await response.json()
                    setUserPosts(data)
                }
            } catch (err) {
                console.error("Erreur lors du fetch des posts:", err)
            }
        }

        fetchProfile()
        fetchUserPosts()
    }, [userId])

    if (loading) return <p className="loading">Chargement...</p>
    if (error) return <p className="error">{error}</p>

    return (
        <div className="profile-page">

            <div className="profile-header">
                <UserInfo user={profileUser} />
                {isOwnProfile && (
                    <button
                        className="edit-profile-btn"
                        onClick={() => navigate(`/profile/${userId}/edit`)}
                    >
                        Modifier le profil
                    </button>
                )}
            </div>

            <div className="profile-content">
                <h3>Posts de {profileUser?.login}</h3>
                <UserPosts
                    posts={userPosts}
                    onPostClick={(postId) => navigate(`/post/${postId}`)}
                />
            </div>

        </div>
    )
}