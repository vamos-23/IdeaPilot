import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "firebase/auth";

interface AuthActions {
  setLoading: (loadingStatus: boolean) => void;
  completeOnboarding: () => Promise<void>;
  setOnboardingStatus: (status: boolean) => void;
  logIn: (userData: User) => void;
  logOut: () => Promise<void>;
}

interface AuthState {
  user: User | null;
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
      set({ hasCompletedOnboarding: false });
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
