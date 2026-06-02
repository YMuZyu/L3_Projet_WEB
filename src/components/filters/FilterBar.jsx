// Barre de filtres : recherche par titre + recherche par auteur + categorie + tri

import SearchBar from './SearchBar.jsx'
import CategoryFilter from './CategoryFilter.jsx'
import SortSelector from './SortSelector.jsx'
import '../../styles/filters/FilterBar.css'

export default function FilterBar({ setSearch, setAuthor, setCategory, setSort, activeCategory, categories }) {
    return (
        <section className="filter-bar">
            <div className="filter-row">
                <SearchBar onSearch={setSearch} placeholder="Titre..." />
                <input
                    type="text"
                    className="search-input"
                    placeholder="Auteur..."
                    onChange={e => setAuthor?.(e.target.value)}
                />
            </div>

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
