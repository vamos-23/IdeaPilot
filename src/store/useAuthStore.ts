import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

interface AppUser {
  userId: string;
  userEmail: string | null;
  userName: string | null;
}

interface AuthActions {
  setLoading: (loadingStatus: boolean) => void;
  completeOnboarding: () => Promise<void>;
  setOnboardingStatus: (status: boolean) => void;
  logIn: (userData: AppUser | null) => void;
  logOut: () => Promise<void>;
}

interface AuthState {
  user: AppUser | null;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
}

type AuthStore = AuthState & AuthActions;

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  hasCompletedOnboarding: false,
  // Actions
  setLoading: (loadingStatus) => set({ isLoading: loadingStatus }),

  setOnboardingStatus: (status) => set({ hasCompletedOnboarding: status }),

  completeOnboarding: async () => {
    try {
      await AsyncStorage.setItem("hasCompletedOnboarding", "true");
      set({ hasCompletedOnboarding: true });
    } catch (e) {
      console.error("Error saving onboarding status", e);
    }
  },

  logIn: (userData) =>
    set({
      user: userData,
    }),

  logOut: async () => {
    await AsyncStorage.removeItem("hasCompletedOnboarding");
    set({
      user: null,
    });
  },
}));
export default useAuthStore;
