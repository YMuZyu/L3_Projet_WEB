import '../../styles/nav/UserButton.css'

export default function UserButton({ user, onClick }) {
    return (
        <button className="header-button" onClick={onClick}>
            {user?.avatar
                ? <img src={user.avatar} alt={user.login} className="user-btn-avatar" />
                : <span className="user-btn-initial">{user?.login?.[0]?.toUpperCase() ?? '👤'}</span>
            }
        </button>
    )
}