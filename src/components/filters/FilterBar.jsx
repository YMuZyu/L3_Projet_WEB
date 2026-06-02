import SearchBar from './SearchBar.jsx'
import CategoryFilter from './CategoryFilter.jsx'
import SortSelector from './SortSelector.jsx'
import '../../styles/filters/FilterBar.css'

export default function FilterBar({ setSearch, setAuthor, setCategory, setSort, activeCategory, categories }) {
    return (
        <section className="filter-bar">
            <SearchBar onSearch={setSearch} />

            {/* Champ recherche par auteur */}
            <input
                type="text"
                className="search-input author-search"
                placeholder="👤 Auteur..."
                onChange={e => setAuthor?.(e.target.value)}
            />

            <div className="filter-controls">
                <CategoryFilter
                    onSelect={setCategory}
                    activeCategory={activeCategory}
                    categories={categories}
                />
                <SortSelector onSort={setSort} />
            </div>
        </section>
    )
}
