# 📦 React Shop — Tài liệu dự án

---

## 🎬 Video Demo

> 🔗 **[Xem demo tại đây](https://drive.google.com/file/d/1QxLB_QymWOqGufnhQSkERjnlx7o1teiC/view?usp=sharing)**  

---

## 1. Luồng xử lý dữ liệu

### 🎨 1.1 Theme (Giao diện sáng / tối)

```
Người dùng click nút toggle
    └─► toggleTheme() [ThemeContext.jsx]
            └─► useLocalStorage("theme") cập nhật giá trị
                    ├─► setTheme() lưu vào localStorage
                    └─► useEffect() thêm / bỏ class "dark" trên <html>
                            └─► Toàn bộ UI re-render theo theme mới (Tailwind dark:*)
```

**Chi tiết:**
- Theme được lưu persistent qua `useLocalStorage` với key `"theme"`, giá trị mặc định là `"light"`.
- `ThemeContext` cung cấp `{ theme, setTheme, toggleTheme }` cho toàn bộ cây component thông qua `ThemeProvider`.
- Khi theme thay đổi, `useEffect` tự động toggle class `dark` trên `document.documentElement`, kích hoạt toàn bộ utility `dark:*` của Tailwind CSS.

---

### 👤 1.2 User Authentication

```
Người dùng nhập username + password [Login.jsx]
    └─► handleSubmit() gọi login(credentials) [AuthContext.jsx]
            └─► Dò tìm trong MOCK_USERS[]
                    ├─► Không khớp → trả về { success: false, message }
                    │       └─► Login.jsx hiển thị lỗi dưới form
                    └─► Khớp → loại bỏ password, lưu safeUser
                            └─► useLocalStorage("auth_user") → setUser(safeUser)
                                    └─► AuthContext cung cấp { user, isAuthenticated: true }
                                            └─► App điều hướng sang trang chính

Người dùng logout
    └─► logout() [AuthContext.jsx]
            └─► setUser(null)
                    ├─► localStorage xóa "auth_user"
                    └─► CartContext nhận user === null
                            └─► dispatch CLEAR_CART → giỏ hàng trống
```

**Chi tiết:**
- `AuthContext` quản lý toàn bộ trạng thái xác thực, cung cấp `{ user, login, logout, isAuthenticated }`.
- Password **không bao giờ** được lưu vào state hay localStorage; chỉ lưu `safeUser` (object đã loại bỏ trường `password`).
- Trạng thái login được persist qua `useLocalStorage("auth_user")`, tức là refresh trang vẫn giữ phiên.

---

### 🛒 1.3 Cart (Giỏ hàng)

```
User thay đổi (login / logout)
    └─► useEffect([user?.id]) [cartContext.jsx]
            ├─► Logout → dispatch CLEAR_CART
            └─► Login → đọc localStorage[cart_user_{id}]
                            └─► dispatch LOAD_CART(storedItems)

Người dùng thêm sản phẩm [Home.jsx → ProductList → ProductCard]
    └─► addToCart(product) [cartContext.jsx]
            └─► dispatch ADD_PRODUCT
                    └─► cartReducer
                            ├─► Sản phẩm đã có → tăng qty
                            └─► Chưa có → thêm mới với qty = 1

Người dùng tương tác trên trang Cart [Cart.jsx]
    ├─► increaseQty(id)  → dispatch INCREASE_QUANTITY
    ├─► decreaseQty(id)  → dispatch DECREASE_QUANTITY (qty=1 → tự xóa)
    ├─► removeItem(id)   → dispatch REMOVE_PRODUCT
    └─► clearCart()      → dispatch CLEAR_CART

Bất kỳ thay đổi nào trên cart
    └─► useEffect([cart, user?.id]) [cartContext.jsx]
            └─► localStorage.setItem(cart_user_{userId}, JSON.stringify(cart))
```

**Chi tiết:**
- Mỗi user có key localStorage riêng (`cart_user_{id}`), cho phép nhiều tài khoản dùng chung thiết bị mà không ảnh hưởng nhau.
- `cartItemIds` là `Set<id>` được memo hóa, dùng để kiểm tra O(1) "sản phẩm đã có trong giỏ chưa" (tránh render lại nút "Add to Cart" sai trạng thái).
- `totalItems` và `totalPrice` được tính toán trong `useMemo` bên trong context, tránh recompute mỗi lần render.
- Toàn bộ logic mutation đặt trong `cartReducer.js` theo pattern Flux/Redux, giữ context thuần về dispatch + derived values.

---

## 2. Hooks sử dụng trong hệ thống

### 🔧 Custom Hooks

| Hook | File | Vai trò |
|------|------|---------|
| `useLocalStorage` | `hooks/useLocalStorage.js` | Đồng bộ state với `localStorage`; được dùng bởi cả `AuthContext` và `ThemeContext` để persist dữ liệu qua các lần tải trang. |
| `useDebounce` | `hooks/useDebounce.js` | Trì hoãn cập nhật một giá trị state sau một khoảng `delay` (mặc định 1000ms). Dùng trong `useFilters` để tránh filter lại sản phẩm mỗi keystroke khi người dùng gõ từ khóa tìm kiếm. |
| `useFilters` | `hooks/useFilters.js` | Quản lý toàn bộ trạng thái filter (keyword, priceRange, category, rating). Kết hợp `useDebounce` + `useMemo` để trả về `filteredProducts` hiệu quả; cung cấp `setFilter`, `resetFilters`, `isFiltered`. |

---

### ⚛️ React Built-in Hooks được dùng

| Hook | Nơi dùng | Mục đích |
|------|----------|----------|
| `useState` | `useLocalStorage`, `useDebounce`, `useFilters`, `Login.jsx` | Quản lý local state của component / hook. |
| `useEffect` | `useDebounce`, `ThemeContext`, `cartContext` | Xử lý side effects: debounce timer, sync class dark, load/save cart theo user. |
| `useReducer` | `cartContext.jsx` | Quản lý state cart phức tạp theo pattern reducer; kết hợp với `cartReducer.js` và `cartActions.js`. |
| `useContext` | `useCart`, `useAuth`, `useTheme` | Truy cập context từ các component con mà không cần prop drilling. |
| `useMemo` | `cartContext.jsx`, `useFilters.js` | Tránh tính toán lại `cartItemIds`, `totalItems`, `totalPrice`, `filteredProducts` trừ khi dependencies thực sự thay đổi. |
| `useCallback` | `Home.jsx` | Memo hóa hàm `handleAddToCart` để tránh tạo function reference mới mỗi render, giảm re-render của `ProductList`. |
| `createContext` | `AuthContext`, `ThemeContext`, `cartContext` | Tạo context object để chia sẻ state toàn cục. |

---