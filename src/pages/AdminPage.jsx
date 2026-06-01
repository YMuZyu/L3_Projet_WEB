import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthProvider.jsx"
import '../styles/pages/AdminPage.css'

const API = ""

export default function AdminPage() {

    const { user, isAuthenticated } = useContext(AuthContext)
    const navigate = useNavigate()

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")

    // Rediriger si pas admin
    useEffect(() => {
        if (!isAuthenticated || !user?.isAdmin) {
            navigate("/")
        }
    }, [isAuthenticated, user])

    useEffect(() => {
        fetchUsers()
    }, [])

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

    const pending = users.filter(u => !u.isValidated)
    const members = users.filter(u => u.isValidated)

    if (loading) return <p className="admin-loading">Chargement...</p>
    if (error)   return <p className="error">{error}</p>

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

            {/* Membres validés */}
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
        </div>
    )
}