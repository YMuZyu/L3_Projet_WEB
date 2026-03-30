import "./SortSelector.css"

export default function SortSelector({onSort}) {
  return (
    <div className="sort">
      <label>Trier par :</label>
      <select onChange={(e)=> onSort(e.target.value)}>
        <option value="recent">Plus récents</option>
        <option value="ancien">Plus anciens</option>
        <option value="alphabetique">A-Z</option>
      </select>
    </div>
  );
}