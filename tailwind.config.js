// tailwind.config.js
// Source of truth for design tokens used across the React app.

export default {
  // Scan every source file that may contain Tailwind class names.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  // Use class-based dark mode so ThemeContext can toggle `dark` on <html>.
  // This keeps theme switching under app control instead of relying on OS preference.
  darkMode: "class",

  theme: {
    extend: {
      // Semantic color tokens. Components should consume these names instead of raw hex values.
      colors: {
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          dark: "#7c83ff",
          DEFAULT: "#6366f1",
        },
        secondary: {
          DEFAULT: "#14b8a6",
        },
        surface: {
          DEFAULT: "#ffffff",
          dark: "#1f2937",
        },
        muted: {
          DEFAULT: "#6b7280",
          dark: "#9ca3af",
        },
        border: {
          DEFAULT: "#e5e7eb",
          dark: "#374151",
        },
        danger: "#ef4444",
        success: "#22c55e",
        warning: "#f59e0b",
      },

      // Global font stack for app typography.
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },

      // Shared radius tokens for reusable UI shapes.
      borderRadius: {
        card: "10px",
        pill: "9999px",
      },
    },
  },
};
