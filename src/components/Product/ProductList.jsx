import { useMemo } from "react";
import { List } from "react-window";
import ProductCard from "./ProductCard";

const ITEMS_PER_ROW = 4;
const ROW_HEIGHT = 400;

function ProductRow({ index, style, rows, onAddToCart, cartItemIds }) {
  const rowItems = rows[index];

  return (
    <div style={style} className="flex gap-[18px] px-1">
      {rowItems.map((product) => (
        <div key={product.id} className="min-w-0 flex-1">
          <ProductCard 
          product={product}
          onAddToCart={onAddToCart}
          isInCart={cartItemIds.has(product.id)}
           />
        </div>
      ))}
      {rowItems.length < ITEMS_PER_ROW &&
        Array.from({ length: ITEMS_PER_ROW - rowItems.length }).map((_, idx) => (
          <div key={idx} className="min-w-0 flex-1" />
        ))}
    </div>
  );
}

function ProductList({ products, onAddToCart, cartItemIds }) {
  const rows = useMemo(() => {
    const groupedRows = [];

    for (let i = 0; i < products.length; i += ITEMS_PER_ROW) {
      groupedRows.push(products.slice(i, i + ITEMS_PER_ROW));
    }

    return groupedRows;
  }, [products]);

  return (
    <section className="pt-3" id="products">
      <div className="mb-5 flex items-end justify-between gap-6 max-md:flex-col max-md:items-stretch">
        <div>
          <p className="mb-2.5 text-[13px] font-extrabold uppercase tracking-[0.08em] text-secondary">
            Product catalog
          </p>
          <h1 className="m-0 text-[42px] leading-[1.08] tracking-normal text-gray-900 dark:text-gray-100 max-md:text-[34px]">
            Featured products
          </h1>
        </div>
        <span className="flex-none rounded-full bg-secondary/10 px-3.5 py-2 text-sm font-extrabold text-secondary dark:bg-secondary/20">
          {products.length} items
        </span>
      </div>

      <List
        defaultHeight={1000}
        overscanCount={2}
        rowComponent={ProductRow}
        rowCount={rows.length}
        rowHeight={ROW_HEIGHT}
        rowProps={{ rows, onAddToCart, cartItemIds }}
        style={{ height: 600, width: "100%" }}
      />
    </section>
  );
}

export default ProductList;
