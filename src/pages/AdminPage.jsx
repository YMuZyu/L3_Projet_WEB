// Page d'administration : gestion des inscriptions et des droits admin
// Accessible uniquement aux administrateurs

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

    // Récupère la liste des utilisateurs au chargement
    useEffect(() => {
        fetchUsers()
        fetchForumStatus()
    }, [])

    // Rediriger si pas admin ou déconnecter
    if (!isAuthenticated || !user?.isAdmin) {
        return <Navigate to="/" replace />
    }

    const fetchForumStatus = async () => {
        try {
            const res = await fetch('http://localhost:10000/admin/forum-status', {
                credentials: 'include'
            })
            if (res.ok) {
                const data = await res.json()
                setForumOpen(data.isOpen)
            }
        } catch {}
    }

    // Récupère tous les utilisateurs depuis le serveur
    const fetchUsers = async () => {
        try {
            const res = await fetch(`${API}/admin/users`, { credentials: "include" })
            if (res.ok) {
                const data = await res.json()
                setUsers(data)
            } else {
                setError("Accès refusé")
            }
        } catch (err) {
            setError("Erreur serveur")
        } finally {
            setLoading(false)
        }
    }

    // Valider ou rejeter un utilisateur
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

    // Donner ou retirer le statut admin à un utilisateur
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
            const res = await fetch('http://localhost:10000/admin/forum-status', {
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

    // Sépare les utilisateurs en attente des membres validés
    const pending = users.filter(u => !u.isValidated)
    const members = users.filter(u => u.isValidated)

    if (loading) return <p className="admin-loading">Chargement...</p>
    if (error) return <p className="error">{error}</p>

    return (
        <div className="admin-page">
            <h1>Administration</h1>

            {message && <p className="admin-message">{message}</p>}

            {/* Inscriptions en attente de validation */}
            <section className="admin-section">
                <h2>Inscriptions en attente ({pending.length})</h2>

                {pending.length === 0
                    ? <p className="admin-empty">Aucune inscription en attente</p>
                    : (
                        <div className="admin-list">
                            {pending.map(u => (
                                <div key={u._id} className="admin-user-card pending">
                                    <span className="admin-login">{u.login}</span>
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

            {/* Liste des membres validés */}
            <section className="admin-section">
                <h2>Membres ({members.length})</h2>

                {members.length === 0
                    ? <p className="admin-empty">Aucun membre validé</p>
                    : (
                        <div className="admin-list">
                            {members.map(u => (
                                <div key={u._id} className="admin-user-card">
                                    <span className="admin-login">{u.login}</span>
                                    {u.isAdmin && <span className="admin-badge">Admin</span>}

                                    {/* On ne peut pas modifier ses propres droits */}
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
                                            </div>
                                        )
                                    }
                                </div>
                            ))}
                        </div>
                    )
                }
            </section>

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