export default function SearchBar({value, onChange, onSearch}){
    return (
        <div>
            <input
                type="text"
                value={value}
                placeholder="Rechercher..."
                onChange={(e) => onChange(e.target.value)}
            />
            <button onClick={onSearch}>Rechercher</button>
        </div>
    )
}