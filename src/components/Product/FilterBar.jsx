// components/Product/FilterBar.jsx
import { memo } from "react";
import Input from "../Common/Input";
// import { DEFAULT_FILTERS } from "../../hooks/useFilters";

const CATEGORIES = ["All", "Fashion", "Accessories", "Home", "Sports", "Tech"];
const MIN_PRICE = 10;
const MAX_PRICE = 999;

// ── Range slider đôi (two-thumb) ───────────────────────────────────────────
// Dùng 2 input[type=range] chồng lên nhau, track giữa tô màu bằng CSS vars
function PriceRangeSlider({ value, onChange }) {
  const [min, max] = value;
  const pctMin = ((min - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
  const pctMax = ((max - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-medium text-slate-500">
        <span>${min}</span>
        <span>${max}</span>
      </div>

      {/* track wrapper */}
      <div className="relative h-5 flex items-center">
        {/* filled track */}
        <div
          className="absolute h-1.5 rounded-full bg-secondary pointer-events-none"
          style={{ left: `${pctMin}%`, right: `${100 - pctMax}%` }}
        />
        {/* base track */}
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-border -z-10 dark:bg-border-dark" />

        {/* thumb min */}
        <input
          type="range"
          min={MIN_PRICE}
          max={MAX_PRICE}
          value={min}
          onChange={(e) => {
            const v = Math.min(Number(e.target.value), max - 1);
            onChange([v, max]);
          }}
          className="range-thumb absolute inset-0 w-full opacity-0 cursor-pointer"
        />
        {/* thumb max */}
        <input
          type="range"
          min={MIN_PRICE}
          max={MAX_PRICE}
          value={max}
          onChange={(e) => {
            const v = Math.max(Number(e.target.value), min + 1);
            onChange([min, v]);
          }}
          className="range-thumb absolute inset-0 w-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
}

// ── Star rating buttons ────────────────────────────────────────────────────
function RatingFilter({ value, onChange }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {[0, 1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange(star === value ? 0 : star)} // toggle off nếu click lại
          className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors
            ${
              value === star
                ? "bg-primary text-white border-primary dark:bg-primary-dark dark:border-primary-dark"
                : "bg-surface text-muted border-border hover:border-primary dark:bg-surface-dark dark:text-muted-dark dark:border-border-dark dark:hover:border-primary-dark"
            }`}
        >
          {star === 0 ? "All" : `${"★".repeat(star)}${"☆".repeat(5 - star)}`}
        </button>
      ))}
    </div>
  );
}

// ── Main FilterBar ─────────────────────────────────────────────────────────
function FilterBar({
  filters,
  setFilter,
  resetFilters,
  isFiltered,
  resultCount,
}) {
  return (
    <div className="card space-y-5">
      {/* Search */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">
          Search
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>
          <Input
            type="text"
            placeholder="Name or category..."
            value={filters.keyword}
            onChange={(e) => setFilter("keyword", e.target.value)}
            className="!pl-9"
          />
        </div>
      </div>

      {/* Price */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
          Price
        </label>
        <PriceRangeSlider
          value={filters.priceRange}
          onChange={(v) => setFilter("priceRange", v)}
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">
          Category
        </label>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter("category", cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors
                ${
                  filters.category === cat
                    ? "bg-primary text-white border-primary dark:bg-primary-dark dark:border-primary-dark"
                    : "bg-surface text-muted border-border hover:border-primary dark:bg-surface-dark dark:text-muted-dark dark:border-border-dark dark:hover:border-primary-dark"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">
          Min Rating
        </label>
        <RatingFilter
          value={filters.rating}
          onChange={(v) => setFilter("rating", v)}
        />
      </div>

      {/* Footer: result count + reset */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
        <span className="text-xs text-slate-400">
          <b className="text-slate-700">{resultCount}</b> products found
        </span>
        {isFiltered && (
          <button
            onClick={resetFilters}
            className="text-xs text-secondary font-semibold hover:underline"
          >
            Reset all
          </button>
        )}
      </div>
    </div>
  );
}

export default memo(FilterBar); // memo tránh re-render khi ProductList scroll
