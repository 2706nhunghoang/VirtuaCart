/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { MOCK_USERS } from "../data/mockUsers";

const AuthContext = createContext(undefined);
const AUTH_STORAGE_KEY = "auth_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage(AUTH_STORAGE_KEY, null);

  const login = (credentials) => {
    const found = MOCK_USERS.find(
      (u) =>
        u.username === credentials.username &&
        u.password === credentials.password,
    );

    if (found) {
      const { password, ...safeUser } = found;
      setUser(safeUser);
      return { success: true };
    }

    return { success: false, message: "Invalid username or password." };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: Boolean(user) }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
