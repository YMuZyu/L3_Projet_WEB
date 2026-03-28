export default function CategoryFilter({value, onChange, onSelect}){
    return (
        <select
            value={value}
            onChange={(e) => {
                onChange(e.target.value)
                onSelect()
            }}
        >
            <option value="">Toutes les catégories</option>
            <option value="Economie">Science</option>
            <option value="Sport">Maths</option>
            <option value="Informatique">Informatique</option>
        </select>
    )
}