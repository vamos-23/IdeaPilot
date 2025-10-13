import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthActions {
  setLoading: (loadingStatus: boolean) => void;
  // setShouldCreateAccount: (signUpStatus: boolean) => void;
  completeOnboarding: () => Promise<void>;
  setOnBoardingStatus: (onBoardingStatus: boolean) => void;
  logIn: (userData: any) => void;
  logOut: () => void;
}

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  // shouldCreateAccount: boolean;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
}

type User = AuthState & AuthActions;

const useAuthStore = create<User>((set) => ({
  user: null,
  // shouldCreateAccount: false, 
  isAuthenticated: false,
  isLoading: true,
  hasCompletedOnboarding: false,

  // Actions
  setLoading: (loadingStatus) => set({ isLoading: loadingStatus }),

  // setShouldCreateAccount: (signUpStatus) =>
  //   set({ shouldCreateAccount: signUpStatus }),

  completeOnboarding: async () => {
    try {
      await AsyncStorage.setItem("hasCompletedOnboarding", "true");
      set({ hasCompletedOnboarding: true });
    } catch (e) {
      console.error("Error saving onboarding status", e);
    }
  },

  setOnBoardingStatus: (onBoardingStatus) =>
    set({ hasCompletedOnboarding: onBoardingStatus }),

  logIn: (userData) =>
    set(() => ({
      user: userData,
      isAuthenticated: true,
    })),

  logOut: () =>
    set(() => ({
      user: null,
      isAuthenticated: false,
    })),
}));
export default useAuthStore;
