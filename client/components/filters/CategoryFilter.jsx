// Filtre par catégorie
// les catégories sont générées dynamiquement depuis les posts existants

import '../../styles/filters/SortSelector.css'

export default function CategoryFilter({ onSelect, activeCategory, categories }) {
    return (
        <select
            id="category-select"
            value={activeCategory}
            onChange={(e) => onSelect(e.target.value)}
            className="filter-select"
        >
            <option value="">Toutes les catégories</option>
            {categories.map(categorie => (
                <option key={categorie} value={categorie}>
                    {categorie}
                </option>
            ))}
        </select>
    )
}