import { memo } from "react";
import Input from "../Common/Input";
import { FILTER_CATEGORIES, MIN_PRICE, MAX_PRICE } from "../../constants/product";

// ── Range price ───────────────────────────────────────────
function PriceRangeSlider({ value, onChange }) {
  const [min, max] = value;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 dark:text-muted-dark">
        <Input
          type="number"
          min={MIN_PRICE}
          max={max - 1}
          value={min}
          onChange={(e) =>
            onChange([Math.max(MIN_PRICE, Number(e.target.value)), max])
          }
          className="input w-full text-sm  dark:border-border-dark dark:bg-surface-dark dark:text-muted-dark"
        />
        <span className="text-slate-400 shrink-0">—</span>
        <Input
          type="number"
          min={min + 1}
          max={MAX_PRICE}
          value={max}
          onChange={(e) =>
            onChange([min, Math.min(MAX_PRICE, Number(e.target.value))])
          }
          className="input w-full text-sm  dark:border-border-dark dark:bg-surface-dark dark:text-muted-dark"
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
          onClick={() => onChange(star === value ? 0 : star)}
          className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors
            ${value === star
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
          {FILTER_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter("category", cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors
                ${filters.category === cat
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
