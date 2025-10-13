import { useEffect } from "react";
import { auth } from "../../config/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuthStore from "./useAuthStore";

export default function useAuthInitializer() {
  useEffect(() => {
    let isMounted = true; 
    const { logIn, logOut, setOnBoardingStatus, setLoading } = useAuthStore.getState();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!isMounted) return;
      if (user) {
        logIn(user);
      } else {
        logOut();
      }
    });

    const loadOnboardingStatus = async () => {
      try {
        const status = await AsyncStorage.getItem("hasCompletedOnboarding");
        if (isMounted) {
          setOnBoardingStatus(status === "true");
        }
      } catch (e) {
        console.error("Failed to load onboarding status!", e);
      } finally {
        if (isMounted) setLoading(false); // always stop loading
      }
    };

    loadOnboardingStatus();

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);
}
