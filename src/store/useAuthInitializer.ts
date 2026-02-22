import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged, signOut, Unsubscribe } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "../../config/FirebaseConfig";
import useAuthStore from "./useAuthStore";

export default function useAuthInitializer() {
  useEffect(() => {
    const store = useAuthStore.getState();
    let unsubscribe: Unsubscribe | undefined;

    const initializeApp = async () => {
      try {
        const status = await AsyncStorage.getItem("hasCompletedOnboarding");
        store.setOnboardingStatus(status === "true");
        console.log("OnboardingStatus:", store.hasCompletedOnboarding);
      } catch (error) {
        console.error("Failed to load onboarding status:", error);
        store.setOnboardingStatus(false);
      }

      unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log(
          "🔹 Firebase Auth state changed:",
          user ? "Logged in" : "Logged out",
        );
        if (user) {
          try {
            //Force refresh the JWT token to see if it exists on server or not
            await user.getIdToken();
            store.logIn({
              userId: user.uid,
              userEmail: user.email,
              userName: user.displayName,
            });
          } catch (error) {
            console.log("User invalid or token expired!", error);
            await signOut(auth);
            store.logOut();
          }
        } else {
          store.logOut();
        }
        store.setAuthInitialized(true);
      });
    };

    initializeApp();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);
}
