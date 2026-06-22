import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ThemeState = {
  theme: "light" | "dark" | "system";
  toggleTheme: () => void;
};

const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light", // system default or fallback to light mode
      toggleEnabled: false,
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
export default useThemeStore;
