import "./SearchBar.css"

export default function SearchBar({onSearch}){
    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Sujet à rechercher"
                className="search-input"
                onChange={(e) => onSearch(e.target.value)}
            />
        </div>
    );
}