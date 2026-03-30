import "./CategoryFilter.css"

export default function CategoryFilter({onSelect,activeCategory,categories}){
    
    return (
        <div className="category-filter">
        <label htmlFor="category-select" >Catégorie :</label>
        <select
            id="category-select"
            value={activeCategory}
            onChange={(e) => onSelect(e.target.value)}
            className="category-select"
        >
            <option value="">Tous</option>
            {categories.map((categorie) => (
            <option key={categorie} value={categorie}>
                {categorie}
            </option>
            ))}
        </select>
        </div>
    );
}