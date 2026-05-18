import Button from "./Button";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button variant="icon" onClick={toggleTheme}>
      {theme === "light" ? "🌙" : "☀️"}
    </Button>
  );
}
