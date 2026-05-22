import { createSlice } from "@reduxjs/toolkit";
import { loginThunk, logout } from "./authSlice";
import { LOCAL_STORAGE_KEYS } from "../../../constants/storage";

// Helper function to load cart for a specific user ID
export function loadCartForUser(userId) {
  if (!userId) return [];
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.CART_USER + userId);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

const getInitialUserId = () => {
  try {
    const storedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH);
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return user?.id || null;
    }
  } catch {
    return null;
  }
  return null;
};

const initialState = {
  items: loadCartForUser(getInitialUserId()),
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existing = state.items.find((item) => item.id === product.id);
      if (existing) {
        existing.qty += 1;
      } else {
        state.items.push({ ...product, qty: 1 });
      }
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
    },
    increaseQty: (state, action) => {
      const id = action.payload;
      const existing = state.items.find((item) => item.id === id);
      if (existing) {
        existing.qty += 1;
      }
    },
    decreaseQty: (state, action) => {
      const id = action.payload;
      const existing = state.items.find((item) => item.id === id);
      if (existing) {
        if (existing.qty <= 1) {
          state.items = state.items.filter((item) => item.id !== id);
        } else {
          existing.qty -= 1;
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginThunk.fulfilled, (state, action) => { // login thành công thì load cart của user
      state.items = loadCartForUser(action.payload?.id);
    });

    builder.addCase(logout, (state) => { // logout thì clear cart
      state.items = [];
    });
  },
});

export const cartActions = cartSlice.actions;
export const {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
