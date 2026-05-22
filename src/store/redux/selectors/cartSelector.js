import { createSelector } from "@reduxjs/toolkit";

const selectCartState = (state) => state.cart;

// khi gọi đến các selector này thì nó sẽ tự động tính toán lại giá trị
// và chỉ tính khi cần thiết
export const selectCartItems = createSelector(
    [selectCartState],
    (cart) => cart.items
);

export const selectCartTotalItems = createSelector(
    [selectCartItems],
    (items) => items.reduce((total, item) => total + item.qty, 0)
);

export const selectTotalItems = createSelector(
    [selectCartItems],
    (items) => items.reduce((total, item) => total + (item.qty || item.quantity || 0), 0)
);

export const selectTotalPrice = createSelector(
    [selectCartItems],
    (items) => items.reduce((total, item) => total + item.price * (item.qty || item.quantity || 0), 0)
);

export const selectCartItemIds = createSelector(
    [selectCartItems],
    (items) => new Set(items.map((item) => item.id))
);