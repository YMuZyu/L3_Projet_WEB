// Sélecteur de tri : par date (récent/ancien) ou alphabétique

import '../../styles/filters/SortSelector.css'

const sortOptions = [
    { value: "recent", label: "Plus récent" },
    { value: "ancien", label: "Plus ancien" },
    { value: "alphabetique", label: "Alphabétique" },
]

export default function SortSelector({ onSort }) {
    return (
        <select
            id="sort-select"
            className="filter-select"
            onChange={(e) => onSort(e.target.value)}
            defaultValue="recent"
        >
            {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    )
}