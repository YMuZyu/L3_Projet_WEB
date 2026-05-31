import SearchBar from './SearchBar.jsx'
import CategoryFilter from './CategoryFilter.jsx'
import SortSelector from './SortSelector.jsx'
import '../../styles/filters/FilterBar.css'

export default function FilterBar({ setSearch, setCategory, setSort, activeCategory, categories }) {
    return (
        <section className="filter-bar">
            <SearchBar onSearch={setSearch} />
            <CategoryFilter
                onSelect={setCategory}
                activeCategory={activeCategory}
                categories={categories}
            />
            <SortSelector onSort={setSort} />
        </section>
    )
}