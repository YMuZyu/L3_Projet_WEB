import '../../styles/commun/Dropdown.css'

export default function Dropdown({ children }) {
    return (
        <div className="dropdown">
            <div className="dropdown-arrow" />
            <div className="dropdown-content">{children}</div>
       </div>
    )
}