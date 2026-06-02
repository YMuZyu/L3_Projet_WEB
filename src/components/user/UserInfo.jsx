import { useState } from 'react'
import ImageCropper from '../shared/ImageCropper.jsx'
import '../../styles/user/UserInfo.css'

export default function UserInfo({ user, isOwnProfile, onAvatarUpdate, onLoginUpdate, postsCount = 0, repliesCount = 0 }) {
    const [showCropper, setShowCropper] = useState(false)
    const [saving, setSaving] = useState(false)
    const [editingLogin, setEditingLogin] = useState(false)
    const [newLogin, setNewLogin] = useState("")
    const [loginError, setLoginError] = useState("")
    const [loginSaving, setLoginSaving] = useState(false)

    if (!user) return null

    const handleCrop = async (base64) => {
        setSaving(true)
        setShowCropper(false)
        try {
            const res = await fetch('http://localhost:10000/user/me/avatar', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ imageBase64: base64 })
            })
            if (res.ok) {
                const data = await res.json()
                onAvatarUpdate?.(data.avatar)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setSaving(false)
        }
    }

    const handleLoginEdit = () => {
        setNewLogin(user.login)
        setLoginError("")
        setEditingLogin(true)
    }

    const handleLoginSubmit = async (e) => {
        e.preventDefault()
        if (!newLogin.trim() || newLogin.trim() === user.login) {
            setEditingLogin(false)
            return
        }
        setLoginSaving(true)
        setLoginError("")
        try {
            const res = await fetch('http://localhost:10000/user/me/login', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ login: newLogin.trim() })
            })
            const data = await res.json()
            if (res.ok) {
                onLoginUpdate?.(data.login)
                setEditingLogin(false)
            } else {
                setLoginError(data.message || "Erreur")
            }
        } catch {
            setLoginError("Erreur serveur")
        } finally {
            setLoginSaving(false)
        }
    }

    return (
        <div className="user-info">

            <div className="user-avatar-wrapper">
                <div className="user-avatar">
                    {user.avatar
                        ? <img src={user.avatar} alt={user.login} />
                        : <div className="avatar-placeholder">{user.login?.[0]?.toUpperCase() ?? '👤'}</div>
                    }
                </div>
                {isOwnProfile && !showCropper && (
                    <button
                        className="avatar-edit-btn"
                        onClick={() => setShowCropper(true)}
                        title="Modifier la photo"
                    >
                        ✏️
                    </button>
                )}
            </div>

            {showCropper && (
                <div className="avatar-cropper-wrapper">
                    <ImageCropper
                        shape="circle"
                        onCrop={handleCrop}
                        onCancel={() => setShowCropper(false)}
                    />
                    {saving && <p className="saving-text">Enregistrement...</p>}
                </div>
            )}

            <div className="user-details">
                {/* Affichage ou édition du pseudo */}
                {editingLogin ? (
                    <form className="login-edit-form" onSubmit={handleLoginSubmit}>
                        <input
                            className="login-edit-input"
                            value={newLogin}
                            onChange={e => setNewLogin(e.target.value)}
                            maxLength={30}
                            autoFocus
                        />
                        <button type="submit" className="login-edit-save" disabled={loginSaving}>✓</button>
                        <button type="button" className="login-edit-cancel" onClick={() => setEditingLogin(false)}>✕</button>
                        {loginError && <p className="login-edit-error">{loginError}</p>}
                    </form>
                ) : (
                    <div className="user-login-row">
                        <h2 className="user-login">{user.login}</h2>
                        {isOwnProfile && (
                            <button
                                className="login-edit-btn"
                                onClick={handleLoginEdit}
                                title="Changer le pseudo"
                            >
                                ✏️
                            </button>
                        )}
                    </div>
                )}

                <p className="user-joined">
                    Membre depuis {new Date(user.createdAt).toLocaleDateString()}
                </p>
                <div className="user-stats">
                    <span>📝 {postsCount} posts</span>
                    <span>💬 {repliesCount} commentaires</span>
                </div>
            </div>
        </div>
    )
}
