// pages/Home.jsx
import { useCallback } from "react";
import FilterBar from "../components/Product/FilterBar";
import ProductList from "../components/Product/ProductList";
import { useFilters } from "../hooks/useFilters";
import { useCart } from "../store/cartContext";

function Home() {
  const { filters, setFilter, resetFilters, filteredProducts, isFiltered } =
    useFilters();
  const { addToCart, cartItemIds } = useCart();

  const handleAddToCart = useCallback(
    (product) => addToCart(product),
    [addToCart]
  );

  return (
    <div className="mx-auto w-[min(1180px,calc(100%-32px))] py-8 pb-14">
      

      {/* Filter + Products */}
      <div className="grid grid-cols-[300px_1fr] gap-8 max-md:grid-cols-1">
        <aside>
          <div className="sticky top-4"> {/* sticky khi scroll */}
            <FilterBar
              filters={filters}
              setFilter={setFilter}
              resetFilters={resetFilters}
              isFiltered={isFiltered}
              resultCount={filteredProducts.length}
            />
          </div>
        </aside>

        <ProductList
          products={filteredProducts}
          onAddToCart={handleAddToCart}
          cartItemIds={cartItemIds}
        />
      </div>
    </div>
  );
}

export default Home;