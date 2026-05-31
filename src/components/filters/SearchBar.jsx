import '../../styles/filters/SearchBar.css'

export default function SearchBar({ onSearch }) {
    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="🔍 Rechercher un sujet..."
                className="search-input"
                onChange={(e) => onSearch(e.target.value)}
            />
        </div>
    )
}