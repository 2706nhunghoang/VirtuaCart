import {
  createContext,
  useReducer,
  useMemo,
  useContext,
  useEffect,
} from "react";
import { cartReducer, initialCartState } from "./cartReducer";
import { CART_ACTIONS } from "./cartActions";
import { useAuth } from "../context/AuthContext";

export const CartContext = createContext(null);

function getCartKey(userId) {
  return `cart_user_${userId}`;
}

export function CartProvider({ children }) {
  const { user } = useAuth();

  // Load cart từ localStorage theo userId khi user thay đổi
  const [cart, dispatch] = useReducer(cartReducer, initialCartState, () => {
    if (!user) return initialCartState;
    try {
      const stored = localStorage.getItem(getCartKey(user.id));
      return stored ? JSON.parse(stored) : initialCartState;
    } catch {
      return initialCartState;
    }
  });

  useEffect(() => {
    if (!user) {
      console.log("logout");
      dispatch({ type: CART_ACTIONS.CLEAR_CART });
      return;
    }
    try {
      const stored = localStorage.getItem(getCartKey(user.id));
      dispatch({
        type: CART_ACTIONS.LOAD_CART,
        payload: stored ? JSON.parse(stored) : [],
      });
    } catch {
      dispatch({ type: CART_ACTIONS.CLEAR_CART });
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem(getCartKey(user.id), JSON.stringify(cart));
  }, [cart, user?.id]);

  // const [cart, dispatch] = useReducer(cartReducer, initialCartState);
  const cartItemIds = useMemo(() => new Set(cart.map((i) => i.id)), [cart]);
  // dùng useMemo để khi cart thay đổi mới tính lại cartItemIDs, tránh tạo Set mới mỗi lần cart thay đổi

  const value = useMemo(
    () => ({
      cart, // mảng sản phẩm giỏ hàng, mỗi item có dạng { id, name, price, qty }
      cartItemIds, // [id1, id2, ...] để nhanh chóng kiểm tra sản phẩm đã có trong giỏ hay chưa
      totalItems: cart.reduce((s, i) => s + i.qty, 0),
      totalPrice: cart.reduce((s, i) => s + i.price * i.qty, 0),
      addToCart: (product) =>
        dispatch({ type: CART_ACTIONS.ADD_PRODUCT, payload: product }),
      removeItem: (id) =>
        dispatch({ type: CART_ACTIONS.REMOVE_PRODUCT, payload: id }),
      increaseQty: (id) =>
        dispatch({ type: CART_ACTIONS.INCREASE_QUANTITY, payload: id }),
      decreaseQty: (id) =>
        dispatch({ type: CART_ACTIONS.DECREASE_QUANTITY, payload: id }),
      clearCart: () => dispatch({ type: CART_ACTIONS.CLEAR_CART }),
    }),
    [cart, cartItemIds],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart phải dùng trong CartProvider");
  return ctx;
}