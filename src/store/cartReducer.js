import { CART_ACTIONS } from "./cartActions";

export const initialCartState = [];

export function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD_PRODUCT: {
      const exists = state.find((i) => i.id === action.payload.id);
      if (exists) {
        return state.map((i) =>
          i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i,
        );
      }
      return [...state, { ...action.payload, qty: 1 }];
    }
    case CART_ACTIONS.REMOVE_PRODUCT: {
      return state.filter((i) => i.id !== action.payload);
    }

    case CART_ACTIONS.INCREASE_QUANTITY:
      return state.map((i) =>
        i.id === action.payload ? { ...i, qty: i.qty + 1 } : i,
      );
    case CART_ACTIONS.DECREASE_QUANTITY:
      return state
        .map((i) =>
          i.id === action.payload
            ? i.qty === 1
              ? null // qty về 0 → đánh dấu xóa
              : { ...i, qty: i.qty - 1 }
            : i,
        )
        .filter(Boolean); // loại bỏ null
    case CART_ACTIONS.CLEAR_CART:
      return [];
    case CART_ACTIONS.LOAD_CART:
      return action.payload;
    default:
      return state;
  }
}
