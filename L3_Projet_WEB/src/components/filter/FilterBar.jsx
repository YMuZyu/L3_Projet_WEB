
import SearchBar from './SearchBar'
import CategoryFilter from './CategoryFilter'
import SortSelector from './SortSelector'

import "./FilterBar.css"

export default function FilterBar({setSearch, setCategory,setSort,activeCategory,categories}){

    return (
        <section className="filter-bar">
            <SearchBar
                onSearch={setSearch}
            />
            <CategoryFilter
                onSelect={setCategory}
                activeCategory={activeCategory}
                categories={categories}
            />
            <SortSelector
                onSort={setSort}
            />
        </section>
    )
}