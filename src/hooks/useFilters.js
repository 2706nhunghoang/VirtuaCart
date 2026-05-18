import { useState, useMemo } from "react";
import { useDebounce } from "./useDebounce";
import { products } from "../data/mockData";

const MIN_PRICE = 10;
const MAX_PRICE = 999;

const DEFAULT_FILTERS = {
  keyword: "",
  priceRange: [MIN_PRICE, MAX_PRICE],
  category: "All",
  rating: 0,
};

export function useFilters() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const debouncedKeyword = useDebounce(filters.keyword, 400);

  const filteredProducts = useMemo(() => {
    const kw = debouncedKeyword.trim().toLowerCase();
    const [minP, maxP] = filters.priceRange;

    return products.filter((p) => {
      if (kw && !`${p.name} ${p.category}`.toLowerCase().includes(kw))
        return false;
      if (p.price < minP || p.price > maxP) return false;
      if (filters.category !== "All" && p.category !== filters.category)
        return false;
      if (filters.rating > 0 && p.rating < filters.rating) return false;
      return true;
    });
  }, [debouncedKeyword, filters.priceRange, filters.category, filters.rating]);

  const setFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const isFiltered =
    filters.keyword !== "" ||
    filters.priceRange[0] !== MIN_PRICE ||
    filters.priceRange[1] !== MAX_PRICE ||
    filters.category !== "All" ||
    filters.rating !== 0;

  return { filters, setFilter, resetFilters, filteredProducts, isFiltered };
}
