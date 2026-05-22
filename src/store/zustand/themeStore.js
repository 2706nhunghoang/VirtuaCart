import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LOCAL_STORAGE_KEYS } from "../../constants/storage";
import { THEMES } from "../../constants/style";


export const useThemeStore = create(
    persist(
        (set) => ({
            theme: THEMES.LIGHT,

            setTheme: (value) =>
                set((state) => {
                    const nextTheme = typeof value === "function" ? value(state.theme) : value;

                    document.documentElement.classList.toggle(THEMES.DARK, nextTheme === THEMES.DARK);

                    return { theme: nextTheme };
                }),
        }),

        {
            name: LOCAL_STORAGE_KEYS.THEME,

            onRehydrateStorage: () => (state) => {
                if (state) {
                    document.documentElement.classList.toggle(THEMES.DARK, state.theme === THEMES.DARK);
                }
            },
        }
    )
);