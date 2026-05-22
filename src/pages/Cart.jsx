import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { formatCurrency } from "../utils/formatCurrency";
import Button from "../components/Common/Button";
import { PAGES } from "../constants/paths";

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyCart({ onNavigate }) {
  return (
    <section className="flex flex-col items-center justify-center py-16 text-center min-h-screen">
      <svg
        className="mb-4 h-12 w-12 text-muted dark:text-muted-dark"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
        />
      </svg>

      <h2 className="mb-6 text-lg font-medium text-gray-900 dark:text-gray-100">
        Your cart is empty
      </h2>

      <Button onClick={() => onNavigate?.(PAGES.HOME)}>Browse Products</Button>
    </section>
  );
}

// ─── Cart page ────────────────────────────────────────────────────────────────
function Cart({ onNavigate }) {
  const { user } = useAuth();
  const {
    cart,
    totalItems,
    totalPrice,
    increaseQty,
    decreaseQty,
    removeItem,
    clearCart,
  } = useCart();

  // Guard: Giỏ trống thì render component EmptyCart luôn
  if (cart.length === 0) return <EmptyCart onNavigate={onNavigate} />;

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 dark:text-white">
      {/* ── Header ── */}
      <div className="mb-6 flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">Shopping Cart ({totalItems})</h1>
          <p className="text-sm text-muted dark:text-muted-dark">
            Hi {user.name}, review your items.
          </p>
        </div>
        <Button
          variant="danger-outline"
          className="text-xs"
          onClick={clearCart}
        >
          Clear Cart
        </Button>
      </div>

      {/* ── Danh sách sản phẩm ── */}
      <div className="space-y-4 mb-6 ">
        {cart.map((item) => (
          <article
            key={item.id}
            className="flex items-center gap-4 border border-border dark:border-border-dark p-3 rounded-xl"
          >
            <img
              className="h-16 w-16 rounded-lg object-cover"
              src={item.image}
              alt={item.name}
            />

            {/* Tên & Giá sản phẩm */}
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold truncate">{item.name}</h2>
              <p className="text-xs text-muted dark:text-muted-dark">
                {formatCurrency(item.price)}
              </p>
            </div>

            {/* Cụm điều khiển số lượng (Dùng luôn component Button của bạn) */}
            <div className="flex items-center gap-1">
              <Button
                variant="action"
                onClick={() => decreaseQty(item.id)}
              >
                −
              </Button>
              <span className="w-8 text-center text-sm font-medium">
                {item.qty}
              </span>
              <Button
                variant="action"
                onClick={() => increaseQty(item.id)}
              >
                +
              </Button>
            </div>

            {/* Nút xóa sản phẩm khỏi giỏ */}
            <Button
              variant="danger-outline"
              className="text-xs px-2 py-1 !rounded-md border-transparent hover:border-danger/20"
              onClick={() => removeItem(item.id)}
            >
              Remove
            </Button>
          </article>
        ))}
      </div>

      {/* ── Phần Tổng Tiền & Nút Thanh Toán ── */}
      <div className="border-t pt-4 space-y-4">
        <div className="flex items-center justify-between text-lg font-bold text-gray-900 dark:text-gray-100">
          <span>Total:</span>
          <span className="text-secondary dark:text-secondary">{formatCurrency(totalPrice)}</span>
        </div>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="px-4"
            onClick={() => onNavigate?.(PAGES.HOME)}
          >
            Back to Shop
          </Button>
        </div>
      </div>
    </section>
  );
}

export default Cart;
