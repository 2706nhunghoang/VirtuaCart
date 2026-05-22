import { useThemeStore } from "../store/zustand/themeStore";
import { THEMES } from "../constants/style";

export function useTheme() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT
    );
  };

  return { theme, setTheme, toggleTheme };
}
