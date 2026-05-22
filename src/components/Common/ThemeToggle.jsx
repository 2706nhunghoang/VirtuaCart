import Button from "./Button";
import { useTheme } from "../../hooks/useTheme";
import { THEMES } from "../../constants/style";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button variant="icon" onClick={toggleTheme}>
      {theme === THEMES.LIGHT ? "🌙" : "☀️"}
    </Button>
  );
}
