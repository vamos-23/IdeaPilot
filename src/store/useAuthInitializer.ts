import { useEffect } from "react";
import { auth } from "../../config/FirebaseConfig";
import { onAuthStateChanged, signOut, Unsubscribe } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuthStore from "./useAuthStore";

export default function useAuthInitializer() {
  const { logIn, logOut, setLoading, setOnboardingStatus } = useAuthStore();

  useEffect(() => {
    let unsubscribe: Unsubscribe | undefined;

    const initializeApp = async () => {
      try {
        setLoading(true);
        const status = await AsyncStorage.getItem("hasCompletedOnboarding");
        setOnboardingStatus(status === "true");
        const onboardingStatus = useAuthStore.getState().hasCompletedOnboarding;
        console.log("OnboardingStatus:", onboardingStatus);
      } catch (error) {
        console.error("Failed to load onboarding status:", error);
        setOnboardingStatus(false);
      }

      unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log(
          "🔹 Firebase Auth state changed:",
          user ? "Logged in" : "Logged out"
        );
        if (user) {
          try {
            //Force refresh the JWT token to see if it exists on server or not
            await user.getIdToken(true);
            logIn(user);
          } catch (error) {
            console.log("User invalid or token expired!", error);
            await signOut(auth);
            logOut();
          }
        } else {
          logOut();
        }
        setLoading(false);
      });
    };

    initializeApp();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [logIn, logOut, setLoading, setOnboardingStatus]);
}
