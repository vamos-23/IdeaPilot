import { onIdTokenChanged, signOut, Unsubscribe } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "../../config/FirebaseConfig";
import useAuthStore from "./useAuthStore";
import useSkillStore from "./useSkillStore";
import { fetchUserSkills } from "../services/users/users.onboarding";

export default function useAuthInitializer() {
  useEffect(() => {
    let unsubscribe: Unsubscribe | undefined;

    const initializeApp = async () => {
      unsubscribe = onIdTokenChanged(auth, async (user) => {
        const store = useAuthStore.getState();
        const skillStore = useSkillStore.getState();

        if (user) {
          try {
            await user.getIdToken();
            const fetchedSkills = await fetchUserSkills(user.uid);

            skillStore.setSkills(fetchedSkills);
            skillStore.toggleSync(true);

            store.logIn({
              userId: user.uid,
              userEmail: user.email,
              userName: user.displayName,
              techStack: fetchedSkills,
            });
          } catch {
            await signOut(auth);
            store.logOut();
            skillStore.clearLocalSkills();
          }
        } else {
          store.logOut();
          skillStore.clearLocalSkills();
        }

        store.setAuthInitialized(true);
      });
    };

    initializeApp();
    return () => unsubscribe?.();
  }, []);
}
