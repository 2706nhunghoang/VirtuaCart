import Input from "../Common/Input";

function SearchBar({ value, onChange }) {

  return (
    <div className="grid gap-2">
      <label
        className="text-sm font-bold text-slate-700"
        htmlFor="product-search"
      >
        Search products
      </label>
      <Input
        id="product-search"
        placeholder="Search by name or category..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

export default SearchBar;
