import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

interface AppUser {
  userId: string;
  userEmail: string | null;
  userName: string | null;
}

interface AuthActions {
  completeOnboarding: () => Promise<void>;
  setOnboardingStatus: (status: boolean) => void;
  setAuthInitialized: (status: boolean) => void;
  logIn: (userData: AppUser | null) => void;
  logOut: () => Promise<void>;
}

interface AuthState {
  user: AppUser | null;
  hasCompletedOnboarding: boolean;
  authInitialized: boolean;
}

type AuthStore = AuthState & AuthActions;

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  authInitialized: false,
  hasCompletedOnboarding: false,
  // Actions
  setOnboardingStatus: (status) => set({ hasCompletedOnboarding: status }),

  setAuthInitialized: (status) => set({ authInitialized: status }),
  
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
