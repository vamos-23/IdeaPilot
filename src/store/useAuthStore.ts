import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AppUser {
  userId: string;
  userEmail: string | null;
  userName: string | null;
}

interface AuthState {
  user: AppUser | null;
  hasCompletedOnboarding: boolean;
  authInitialized: boolean;

  setOnboardingStatus: (status: boolean) => void;
  setAuthInitialized: (status: boolean) => void;
  logIn: (userData: AppUser) => void;
  logOut: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      hasCompletedOnboarding: false,
      authInitialized: false,

      setOnboardingStatus: (status) =>
        set({ hasCompletedOnboarding: status }),

      setAuthInitialized: (status) =>
        set({ authInitialized: status }),

      logIn: (userData) =>
        set({
          user: userData,
        }),

      logOut: () =>
        set({
          user: null,
          hasCompletedOnboarding: false,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),

      partialize: (state) => ({
        user: state.user,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
      }),
    }
  )
);

export default useAuthStore;