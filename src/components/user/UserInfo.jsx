import { useState } from 'react'
import ImageCropper from '../shared/ImageCropper.jsx'
import '../../styles/user/UserInfo.css'

export default function UserInfo({ user, isOwnProfile, onAvatarUpdate }) {
    const [showCropper, setShowCropper] = useState(false)
    const [saving,      setSaving]      = useState(false)

    if (!user) return null

    const avatarSrc = user.avatar
        ? `http://localhost:10000${user.avatar}`
        : null

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

    return (
        <div className="user-info">
            <div className="user-avatar-wrapper">
                <div className="user-avatar">
                    {avatarSrc
                        ? <img src={avatarSrc} alt={user.login} />
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
                <h2 className="user-login">{user.login}</h2>
                <p className="user-joined">
                    Membre depuis {new Date(user.createdAt).toLocaleDateString()}
                </p>
                <div className="user-stats">
                    <span>📝 {user.postsCount ?? 0} posts</span>
                    <span>💬 {user.repliesCount ?? 0} commentaires</span>
                </div>
            </div>
        </div>
    )
}