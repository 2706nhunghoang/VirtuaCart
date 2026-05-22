import { useDispatch, useSelector } from "react-redux";
import { loginThunk, logout, authSelectors } from "../store/redux/slices/authSlice";
import { useCallback } from "react";

export function useAuth() {
  const dispatch = useDispatch(); // dispatch a function that can dispatch actions to the store
  const user = useSelector(authSelectors.user); // selector function to get the user from the store
  const loading = useSelector(authSelectors.loading);

  const login = useCallback(
    async (credentials) => {
      // .unwrap() để khi action bị reject thì throw để component tự catch
      const result = await dispatch(loginThunk(credentials)).unwrap();
      return result;
    },
    [dispatch]
  );

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return {
    user,
    login,
    logout: handleLogout,
    isLoggedIn: !!user,
    isAuthenticated: !!user,
    loading,
  };
}
