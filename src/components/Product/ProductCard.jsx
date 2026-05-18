import { memo } from "react";
import Button from "../Common/Button";
import { formatCurrency } from "../../utils/formatCurrency";

const ProductCard = memo(function ProductCard({
  product,
  isInCart = false,
  isFeatured = false,
  onAddToCart,
}) {
  const isOutOfStock = product.stock <= 0;
  const price = formatCurrency(product.price);

  const cardClasses = `card card-hover overflow-hidden ${
    isFeatured
      ? "border-primary ring-1 ring-primary/20 dark:border-primary-dark"
      : ""
  } ${isOutOfStock ? "opacity-60 saturate-75" : ""}`.trim();

  const buttonClasses = `px-3 shrink-0 ${
    isInCart
      ? "bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary/30 dark:bg-secondary dark:hover:bg-secondary/90"
      : isOutOfStock
        ? "bg-muted text-white hover:bg-muted dark:bg-muted-dark dark:hover:bg-muted-dark"
        : ""
  }`.trim();

  return (
    <article className={cardClasses}>
      <img
        className="aspect-square w-full min rounded-card bg-slate-200 object-cover"
        src={product.image}
        alt={product.name}
        loading="lazy"
      />

      <div className="grid gap-3">
        <div className="flex items-center justify-between gap-3 text-[13px] font-bold text-muted dark:text-muted-dark">
          <span>{product.category}</span>
        </div>

        <h2 className="m-0 min-h-[46px] text-lg leading-tight tracking-normal text-gray-900 dark:text-gray-100">
          {product.name}
        </h2>
        <p className="m-0 min-h-11 text-sm leading-[1.45] text-muted dark:text-muted-dark">
          {product.description}
        </p>

        <div className="flex items-center justify-between gap-3">
          <div className="grid gap-1 min-w-0">
            <strong className="text-lg text-primary dark:text-primary-100">
              {price}
            </strong>
            <span className="text-xs text-muted dark:text-muted-dark">
              {product.rating}/5 rating
            </span>
          </div>

          <Button
            className={buttonClasses}
            disabled={isOutOfStock}
            onClick={() => onAddToCart?.(product)}
          >
            {isOutOfStock ? "Unavailable" : isInCart ? "In cart" : "Add"}
          </Button>
        </div>
      </div>
    </article>
  );
});

export default ProductCard;
