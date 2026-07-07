import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark" | "system";

type ThemeState = {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  clearPreference: () => void;
  reset: () => void;
};

const initialState = {
  theme: "dark" as ThemeMode,
};

const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      ...initialState,

      setTheme: (mode) =>
        set({
          theme: mode,
        }),

      clearPreference: () =>
        set({
          theme: "dark",
        }),

      reset: () =>
        set({
          ...initialState,
        }),
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useThemeStore;
