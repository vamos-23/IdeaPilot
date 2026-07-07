import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Skill from "../constants/types";

interface AppUser {
  userId: string;
  userEmail: string | null;
  userName: string | null;
  techStack: Skill[];
}

interface AuthState {
  user: AppUser | null;
  hasCompletedOnboarding: boolean;
  authInitialized: boolean;

  setOnboardingStatus: (status: boolean) => void;
  setAuthInitialized: (status: boolean) => void;
  logIn: (userData: AppUser) => void;
  logOut: () => void;
  refreshUser: (userEmail: string | null, userName: string | null) => void;
  updateTechStack: (skills: Skill[]) => void;
  reset: () => void;
}

const initialState = {
  user: null,
  hasCompletedOnboarding: false,
};

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      authInitialized: false,
      ...initialState,

      setOnboardingStatus: (status) =>
        set({
          hasCompletedOnboarding: status,
        }),

      setAuthInitialized: (status) =>
        set({
          authInitialized: status,
        }),

      updateTechStack: (skills) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                techStack: skills,
              }
            : null,
        })),

      logIn: (userData) =>
        set({
          user: userData,
        }),

      logOut: () =>
        set({
          user: null,
        }),

      refreshUser: (userEmail, userName) => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                userName,
                userEmail,
              }
            : null,
        }));
      },

      reset: () =>
        set({
          ...initialState,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
      }),
    },
  ),
);

export default useAuthStore;
