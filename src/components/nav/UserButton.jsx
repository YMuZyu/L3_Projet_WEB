import '../../styles/nav/UserButton.css'

export default function UserButton({ onClick }) {
    return (
        <button className="header-button" onClick={onClick}>
            👤
        </button>
    )
}