import { useState, useEffect, useContext } from "react"
import { useNavigate, Navigate } from "react-router-dom"
import { AuthContext } from "../context/AuthProvider.jsx"
import '../styles/pages/AdminPage.css'

const API = "http://localhost:10000"

export default function AdminPage() {

    const { user, isAuthenticated } = useContext(AuthContext)
    const navigate = useNavigate()

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [forumOpen, setForumOpen] = useState(true)
    const [userSearch, setUserSearch] = useState("")

    useEffect(() => {
        fetchUsers()
        fetchForumStatus()
    }, [])

    if (!isAuthenticated || !user?.isAdmin) {
        return <Navigate to="/" replace />
    }

    const fetchForumStatus = async () => {
        try {
            const res = await fetch(`${API}/admin/forum-status`, { credentials: 'include' })
            if (res.ok) {
                const data = await res.json()
                setForumOpen(data.isOpen)
            }
        } catch {}
    }

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${API}/admin/users`, { credentials: "include" })
            if (res.ok) {
                setUsers(await res.json())
            } else {
                setError("Accès refusé")
            }
        } catch {
            setError("Erreur serveur")
        } finally {
            setLoading(false)
        }
    }

    const handleValidate = async (id, isValidated) => {
        try {
            const res = await fetch(`${API}/admin/users/${id}/validate`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ isValidated })
            })
            const data = await res.json()
            setMessage(data.message)
            fetchUsers()
        } catch {
            setMessage("Erreur serveur")
        }
    }

    const handleToggleAdmin = async (id, isAdmin) => {
        try {
            const res = await fetch(`${API}/admin/users/${id}/admin`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ isAdmin })
            })
            const data = await res.json()
            setMessage(data.message)
            fetchUsers()
        } catch {
            setMessage("Erreur serveur")
        }
    }

    const handleToggleForum = async () => {
        try {
            const res = await fetch(`${API}/admin/forum-status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ isOpen: !forumOpen })
            })
            if (res.ok) {
                setForumOpen(!forumOpen)
                setMessage(forumOpen ? "Forum fermé" : "Forum ouvert")
            }
        } catch {}
    }

    const pending = users.filter(u => !u.isValidated)

    // Membres validés filtrés par la recherche
    const members = users
        .filter(u => u.isValidated)
        .filter(u => !userSearch || u.login?.toLowerCase().includes(userSearch.toLowerCase()))

    if (loading) return <p className="admin-loading">Chargement...</p>
    if (error) return <p className="error">{error}</p>

    return (
        <div className="admin-page">
            <h1>Administration</h1>

            {message && <p className="admin-message">{message}</p>}

            {/* Inscriptions en attente */}
            <section className="admin-section">
                <h2>Inscriptions en attente ({pending.length})</h2>

                {pending.length === 0
                    ? <p className="admin-empty">Aucune inscription en attente</p>
                    : (
                        <div className="admin-list">
                            {pending.map(u => (
                                <div key={u._id} className="admin-user-card pending">
                                    <span
                                        className="admin-login admin-login-link"
                                        onClick={() => navigate(`/profile/${u._id}`)}
                                        title="Voir le profil"
                                    >
                                        {u.login}
                                    </span>
                                    <span className="admin-date">
                                        Inscrit le {new Date(u.createdAt).toLocaleDateString()}
                                    </span>
                                    <div className="admin-actions">
                                        <button
                                            className="btn-validate"
                                            onClick={() => handleValidate(u._id, true)}
                                        >
                                            Valider
                                        </button>
                                        <button
                                            className="btn-reject"
                                            onClick={() => handleValidate(u._id, false)}
                                        >
                                            Rejeter
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                }
            </section>

            {/* Liste des membres avec recherche */}
            <section className="admin-section">
                <div className="admin-section-header">
                    <h2>Membres ({members.length}{userSearch ? ` sur ${users.filter(u => u.isValidated).length}` : ""})</h2>
                    <input
                        className="admin-search-input"
                        type="text"
                        placeholder="Chercher un utilisateur..."
                        value={userSearch}
                        onChange={e => setUserSearch(e.target.value)}
                    />
                </div>

                {members.length === 0
                    ? <p className="admin-empty">{userSearch ? "Aucun utilisateur trouvé" : "Aucun membre validé"}</p>
                    : (
                        <div className="admin-list">
                            {members.map(u => (
                                <div key={u._id} className="admin-user-card">
                                    {/* Login cliquable → profil pour exercer les droits depuis le profil */}
                                    <span
                                        className="admin-login admin-login-link"
                                        onClick={() => navigate(`/profile/${u._id}`)}
                                        title="Voir le profil et exercer les droits admin"
                                    >
                                        {u.login}
                                    </span>
                                    {u.isAdmin && <span className="admin-badge">Admin</span>}

                                    {u._id.toString() === user._id.toString()
                                        ? <span className="admin-self">(vous)</span>
                                        : (
                                            <div className="admin-actions">
                                                <button
                                                    className={u.isAdmin ? "btn-remove-admin" : "btn-give-admin"}
                                                    onClick={() => handleToggleAdmin(u._id, !u.isAdmin)}
                                                >
                                                    {u.isAdmin ? "Retirer admin" : "Donner admin"}
                                                </button>
                                                <button
                                                    className="btn-reject"
                                                    onClick={() => handleValidate(u._id, false)}
                                                >
                                                    Révoquer membre
                                                </button>
                                                <button
                                                    className="btn-profile"
                                                    onClick={() => navigate(`/profile/${u._id}`)}
                                                >
                                                    👤 Profil
                                                </button>
                                            </div>
                                        )
                                    }
                                </div>
                            ))}
                        </div>
                    )
                }
            </section>

            {/* Statut du forum */}
            <section className="admin-section">
                <h2>🔒 Statut du forum</h2>
                <div className="forum-status">
                    <span className={`status-badge ${forumOpen ? 'open' : 'closed'}`}>
                        {forumOpen ? '🟢 Forum ouvert' : '🔴 Forum fermé'}
                    </span>
                    <button
                        className={forumOpen ? 'btn-reject' : 'btn-validate'}
                        onClick={handleToggleForum}
                    >
                        {forumOpen ? 'Fermer le forum' : 'Ouvrir le forum'}
                    </button>
                </div>
            </section>
        </div>
    )
}
