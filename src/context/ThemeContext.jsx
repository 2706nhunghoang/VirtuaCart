/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const THEMES = {
  LIGHT: "light",
  DARK: "dark",
};

const THEME_STORAGE_KEY = "theme";
const DEFAULT_THEME = THEMES.LIGHT;

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage(
    THEME_STORAGE_KEY,
    DEFAULT_THEME,
  );

  useEffect(() => {
    document.documentElement.classList.toggle(
      THEMES.DARK,
      theme === THEMES.DARK,
    );
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT,
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
