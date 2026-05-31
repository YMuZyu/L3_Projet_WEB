import '../../styles/user/UserInfo.css'

export default function UserInfo({ user }) {

    if (!user) return null

    return (
        <div className="user-info">
            <div className="user-avatar">
                {user.avatar
                    ? <img src={user.avatar} alt={user.login} />
                    : <div className="avatar-placeholder">👤</div>
                }
            </div>
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