// Barre de filtres : recherche + filtre par catégorie + tri
// Les selects sont groupés à droite de la barre de recherche

import SearchBar from './SearchBar.jsx'
import CategoryFilter from './CategoryFilter.jsx'
import SortSelector from './SortSelector.jsx'
import '../../styles/filters/FilterBar.css'

export default function FilterBar({ setSearch, setCategory, setSort, activeCategory, categories }) {
    return (
        <section className="filter-bar">
            <SearchBar onSearch={setSearch} />

            {/* Groupe des selects à droite */}
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