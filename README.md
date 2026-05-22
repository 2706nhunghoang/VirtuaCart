# VirtuaCart - Luồng xử lý phiên bản State Management

## Link Deploy

[Truy cập tại đây](https://elegant-cocada-1ce486.netlify.app/)

---

## 1. Tổng quan kiến trúc state

Phiên bản mới không còn dùng `AuthContext`, `ThemeContext`, `cartContext`, `cartReducer` và `cartActions` tự viết. State toàn cục được tách lại như sau:

| Phần state | Công nghệ | File chính | Vai trò |
| --- | --- | --- | --- |
| Authentication | Redux Toolkit | `src/store/redux/slices/authSlice.js` | Đăng nhập, đăng xuất, lưu user hiện tại, trạng thái loading/error |
| Cart | Redux Toolkit | `src/store/redux/slices/cartSlice.js` | Thêm/xóa sản phẩm, tăng/giảm số lượng, clear cart, load cart theo user |
| Cart derived data | Reselect từ Redux Toolkit | `src/store/redux/selectors/cartSelector.js` | Tính `totalItems`, `totalPrice`, `cartItemIds` |
| Theme | Zustand + persist middleware | `src/store/zustand/themeStore.js` | Lưu theme sáng/tối và đồng bộ class `dark` lên thẻ `<html>` |
| Component API | Custom hooks | `src/hooks/useAuth.js`, `src/hooks/useCart.js`, `src/hooks/useTheme.js` | Che giấu chi tiết Redux/Zustand để component dùng API đơn giản |

Redux store được inject vào toàn app tại `src/main.jsx`:

```jsx
<Provider store={store}>
  <App />
</Provider>
```

---

## 2. Luồng Authentication

### 2.1 Khởi tạo trạng thái đăng nhập

```text
App load
  -> authSlice initialState
      -> loadUserFromStorage()
          -> đọc localStorage["auth_user"]
              -> có user: set user + isAuthenticated = true
              -> không có user: user = null + isAuthenticated = false
```

`authSlice` đọc user từ `localStorage` bằng key `auth_user`. Nếu trình duyệt còn user đã lưu thì app giữ phiên đăng nhập sau khi refresh.

### 2.2 Đăng nhập

```text
Người dùng nhập username/password tại Login.jsx
  -> handleSubmit()
      -> useAuth().login(credentials)
          -> dispatch(loginThunk(credentials)).unwrap()
              -> loginThunk dò trong MOCK_USERS
                  -> sai thông tin:
                      -> rejectWithValue("Invalid username or password.")
                      -> Login.jsx catch lỗi và hiển thị dưới form
                  -> đúng thông tin:
                      -> loại bỏ password khỏi user
                      -> lưu safeUser vào localStorage["auth_user"]
                      -> fulfilled action cập nhật Redux auth state
                      -> AppContent thấy isAuthenticated = true
                      -> render Home
```

Password không được lưu vào Redux state hoặc `localStorage`. `loginThunk` chỉ trả về `safeUser` sau khi đã bỏ trường `password`.

### 2.3 Đăng xuất

```text
Người dùng bấm Logout tại Header.jsx
  -> useAuth().logout()
      -> dispatch(logout())
          -> authSlice:
              -> user = null
              -> isAuthenticated = false
              -> error = null
              -> xóa localStorage["auth_user"]
          -> cartSlice extraReducers bắt action logout:
              -> items = []
          -> AppContent render lại Login
```

Cart trong Redux được clear ngay khi logout để không hiển thị giỏ hàng của user cũ trên phiên hiện tại.

---

## 3. Luồng Cart

### 3.1 Khởi tạo cart theo user hiện tại

```text
App load
  -> cartSlice initialState
      -> getInitialUserId()
          -> đọc localStorage["auth_user"]
          -> lấy user.id nếu có
      -> loadCartForUser(userId)
          -> đọc localStorage["cart_user_" + userId]
          -> có dữ liệu: parse thành items
          -> không có dữ liệu: []
```

Mỗi user có một cart riêng theo key:

```text
cart_user_1
cart_user_2
cart_user_3
```

Nhờ vậy nhiều tài khoản dùng chung một trình duyệt vẫn không bị lẫn giỏ hàng.

### 3.2 Load cart sau khi login

```text
loginThunk fulfilled
  -> cartSlice extraReducers
      -> loadCartForUser(action.payload.id)
      -> state.items = cart của user vừa login
```

Khi đăng nhập thành công, `cartSlice` tự thay `items` bằng cart đã lưu của user đó.

### 3.3 Thêm sản phẩm vào cart

```text
Home.jsx
  -> useFilters() trả về filteredProducts
  -> ProductList render danh sách bằng react-window
  -> ProductCard nhận isInCart từ cartItemIds.has(product.id)
  -> Người dùng bấm Add
      -> handleAddToCart(product)
          -> useCart().addToCart(product)
              -> dispatch(addToCart(product))
                  -> cartSlice:
                      -> nếu item đã tồn tại: tăng qty += 1
                      -> nếu chưa tồn tại: thêm item mới với qty = 1
```

`ProductCard` đổi trạng thái nút theo cart:

| Điều kiện | Text nút |
| --- | --- |
| `stock <= 0` | `Unavailable` |
| Sản phẩm đã có trong cart | `In cart` |
| Có thể thêm | `Add` |

### 3.4 Cập nhật cart tại trang Cart

```text
Cart.jsx
  -> useCart()
      -> cart, totalItems, totalPrice
      -> increaseQty, decreaseQty, removeItem, clearCart

Người dùng thao tác:
  -> bấm +:
      -> dispatch(increaseQty(id))
      -> qty += 1
  -> bấm -:
      -> dispatch(decreaseQty(id))
      -> qty > 1: qty -= 1
      -> qty <= 1: xóa item khỏi cart
  -> bấm Remove:
      -> dispatch(removeFromCart(id))
      -> xóa item khỏi cart
  -> bấm Clear Cart:
      -> dispatch(clearCart())
      -> items = []
```

Nếu `cart.length === 0`, `Cart.jsx` render `EmptyCart` và cho phép quay lại trang sản phẩm.

### 3.5 Persist cart vào localStorage

Việc lưu cart không nằm trong component. Nó được xử lý tập trung tại `src/store/redux/store.js`:

```text
Redux store thay đổi
  -> store.subscribe()
      -> lấy state.auth.user?.id
      -> nếu chưa login: bỏ qua
      -> nếu state.cart.items không đổi reference: bỏ qua
      -> nếu cart đổi:
          -> localStorage.setItem("cart_user_" + userId, JSON.stringify(items))
```

`previousCartItems` được dùng để tránh ghi lại `localStorage` khi cart không đổi.

---

## 4. Luồng Theme

Theme được chuyển từ Context sang Zustand.

```text
ThemeToggle.jsx
  -> useTheme()
      -> đọc theme từ useThemeStore
      -> lấy setTheme từ useThemeStore
  -> toggleTheme()
      -> setTheme(currentTheme => light ? dark : light)
          -> themeStore.setTheme()
              -> cập nhật theme trong Zustand
              -> toggle class "dark" trên document.documentElement
              -> persist middleware lưu vào localStorage["theme"]
```

Khi reload trang:

```text
Zustand persist rehydrate
  -> đọc localStorage["theme"]
  -> onRehydrateStorage()
      -> nếu theme === "dark": thêm class dark vào <html>
      -> nếu theme === "light": bỏ class dark khỏi <html>
```

Component không cần biết Zustand persist hoạt động thế nào. UI chỉ gọi `useTheme()` và nhận `{ theme, setTheme, toggleTheme }`.

---

## 5. Luồng Filter sản phẩm

Filter vẫn là local state vì chỉ phục vụ trang `Home`, không cần đưa vào global store.

```text
Home.jsx
  -> useFilters()
      -> useState(DEFAULT_FILTERS)
      -> useDebounce(filters.keyword, 400)
      -> useMemo() lọc products
          -> keyword: tìm theo name/category
          -> priceRange: lọc theo min/max
          -> category: lọc theo category
          -> rating: lọc theo rating tối thiểu
      -> trả về filters, setFilter, resetFilters, filteredProducts, isFiltered

FilterBar.jsx
  -> nhận filters và setFilter qua props
  -> thay đổi search/price/category/rating
  -> Home nhận filteredProducts mới
  -> ProductList render lại danh sách
```

`ProductList` dùng `react-window` để render danh sách lớn 1000 sản phẩm theo từng row, giúp giảm số lượng DOM node cần render cùng lúc.

---

## 6. Vai trò của các custom hook

| Hook | File | Vai trò |
| --- | --- | --- |
| `useAuth` | `src/hooks/useAuth.js` | Dùng `useDispatch`, `useSelector`; expose `user`, `login`, `logout`, `isAuthenticated`, `loading` |
| `useCart` | `src/hooks/useCart.js` | Dùng selector và action Redux; expose cart API cho component |
| `useTheme` | `src/hooks/useTheme.js` | Dùng Zustand store; expose `theme`, `setTheme`, `toggleTheme` |
| `useFilters` | `src/hooks/useFilters.js` | Quản lý filter local cho trang Home |
| `useDebounce` | `src/hooks/useDebounce.js` | Delay keyword search để tránh filter lại sau mỗi ký tự |
| `useLocalStorage` | `src/hooks/useLocalStorage.js` | Hook cũ vẫn còn trong source, nhưng luồng auth/theme/cart mới không còn phụ thuộc trực tiếp vào hook này |

Các component chỉ gọi hook theo nhu cầu, ví dụ:

```jsx
const { user, logout } = useAuth();
const { totalItems } = useCart();
const { theme, toggleTheme } = useTheme();
```

Cách này giúp component không phụ thuộc trực tiếp vào cấu trúc Redux slice hoặc Zustand store.

---

## 7. Luồng render chính của app

```text
main.jsx
  -> tạo React root
  -> bọc App bằng Redux Provider

App.jsx
  -> giữ currentPage bằng useState
  -> render Layout
  -> AppContent kiểm tra useAuth().isAuthenticated
      -> chưa login: Login
      -> đã login + currentPage === "cart": Cart
      -> đã login + còn lại: Home

Layout/Header
  -> Header đọc user từ useAuth
  -> Header đọc totalItems từ useCart
  -> Header gọi onNavigate("home" | "cart")
  -> ThemeToggle đổi theme qua Zustand
```

App hiện dùng state `currentPage` nội bộ thay vì React Router. `PAGES` trong `src/constants/paths.js` định nghĩa các page key như `home`, `cart`, `login`.

---

## 8. Các điểm chính của phiên bản mới

- Redux Toolkit thay thế Context/useReducer cho `auth` và `cart`.
- Zustand thay thế ThemeContext cho `theme`.
- `react-redux` `Provider` được đặt tại `main.jsx`.
- `authSlice` dùng `createAsyncThunk` cho login mock.
- `cartSlice` dùng `extraReducers` để phản ứng với login/logout.
- Cart được lưu theo từng user bằng `store.subscribe`.
- Selector dùng `createSelector` để tính derived data như `totalItems`, `totalPrice`, `cartItemIds`.
- Component truy cập state qua custom hooks, không import trực tiếp store/slice.
- Filter vẫn là local state vì không cần chia sẻ toàn app.
- Product list dùng `react-window` để tối ưu render danh sách lớn.
