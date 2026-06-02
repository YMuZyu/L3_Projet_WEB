// Barre de filtres : recherche par titre + recherche par auteur + catégorie + tri

import SearchBar from './SearchBar.jsx'
import CategoryFilter from './CategoryFilter.jsx'
import SortSelector from './SortSelector.jsx'
import '../../styles/filters/FilterBar.css'

export default function FilterBar({ setSearch, setAuthor, setCategory, setSort, activeCategory, categories }) {
    return (
        <section className="filter-bar">

            {/* Ligne 1 : deux champs de recherche */}
            <div className="filter-row">
                <SearchBar onSearch={setSearch} placeholder="🔍 Rechercher un sujet..." />
                <SearchBar onSearch={setSearch} placeholder="✍️ Rechercher par auteur..." />
            </div>

            {/* Groupe des selects */}
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