import { useState } from "react"
import SearchBar from './SearchBar'
import CategoryFilter from './CategoryFilter'
import SortSelector from './SortSelector'

export default function FilterBar({setPosts}){
    const [searchKeyword, setSearchKeyword] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [sortOrder, setSortOrder] = useState("recent");

    // envoyer une requete au serveur quand user veut chercher une catégorie ou trier la liste
    // rafraichir les posts aussi
    const updatePosts = () => {

    }

    return (
        <section className="filter-bar">
            <SearchBar
                value={searchKeyword}
                onChange={(val) => setSearchKeyword(val)}
                onSearch={updatePosts}
            />
            <CategoryFilter
                value={selectedCategory}
                onChange={(val) => setSelectedCategory(val)}
                onSelect={updatePosts}
            />
            <SortSelector
                value={sortOrder}
                onChange={(val) => setSortOrder(val)}
                onSort={updatePosts}
            />
        </section>
    )
}