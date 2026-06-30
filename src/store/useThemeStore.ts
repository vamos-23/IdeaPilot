import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark" | "system";

type ThemeState = {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
};

const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "system", // system default or fallback to light mode
      setTheme: (mode) => set({ theme: mode }),
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
export default useThemeStore;
