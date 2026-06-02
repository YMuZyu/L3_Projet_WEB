// Champ de recherche en temps réel : filtre les posts par titre et/ou auteur
import '../../styles/filters/SearchBar.css'

export default function SearchBar({ onSearch, placeholder }) {
    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder={placeholder}
                className="search-input"
                onChange={(e) => onSearch(e.target.value)}
            />
        </div>
    )
}