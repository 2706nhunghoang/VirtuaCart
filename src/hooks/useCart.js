import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCartItems,
  selectTotalItems,
  selectTotalPrice,
  selectCartItemIds,
} from "../store/redux/selectors/cartSelector";
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  increaseQty as increaseQtyAction,
  decreaseQty as decreaseQtyAction,
  clearCart as clearCartAction,
} from "../store/redux/slices/cartSlice";

export function useCart() {
  const dispatch = useDispatch();

  const cart = useSelector(selectCartItems);
  const cartItems = cart;
  const totalItems = useSelector(selectTotalItems);
  const totalPrice = useSelector(selectTotalPrice);
  const cartItemIds = useSelector(selectCartItemIds);

  const addToCart = useCallback(
    (product) => dispatch(addToCartAction(product)),
    [dispatch]
  );

  const removeFromCart = useCallback(
    (id) => dispatch(removeFromCartAction(id)),
    [dispatch]
  );

  const removeItem = useCallback(
    (id) => dispatch(removeFromCartAction(id)),
    [dispatch]
  );

  const increaseQty = useCallback(
    (id) => dispatch(increaseQtyAction(id)),
    [dispatch]
  );

  const decreaseQty = useCallback(
    (id) => dispatch(decreaseQtyAction(id)),
    [dispatch]
  );

  const clearCart = useCallback(
    () => dispatch(clearCartAction()),
    [dispatch]
  );

  return {
    cart,
    cartItems,
    totalItems,
    totalPrice,
    cartItemIds,
    addToCart,
    removeFromCart,
    removeItem,
    increaseQty,
    decreaseQty,
    clearCart,
  };
}
