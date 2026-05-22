import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
});
let previousCartItems = null;

store.subscribe(() => {
  const state = store.getState();
  const userId = state.auth.user?.id;

  if (!userId) return;

  if (state.cart.items === previousCartItems) return;

  previousCartItems = state.cart.items;
  localStorage.setItem(`cart_user_${userId}`, JSON.stringify(state.cart.items));
});
