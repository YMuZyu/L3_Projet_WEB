export default function SortSelector({ value, onChange, onSort }) {
  return (
    <select
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
        onSort();
      }}
    >
      <option value="recent">Les plus récents</option>
      <option value="popular">Les plus populaires</option>
    </select>
  );
}