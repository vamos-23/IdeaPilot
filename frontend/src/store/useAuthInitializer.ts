import { onIdTokenChanged, signOut, Unsubscribe } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "../../config/FirebaseConfig";
import { fetchUserSkills } from "../services/users/users.onboarding";
import useAuthStore from "./useAuthStore";
import useSkillStore from "./useSkillStore";
import { AppState, AppStateStatus } from "react-native";

export default function useAuthInitializer() {
  useEffect(() => {
    let unsubscribe: Unsubscribe | undefined;

    const initializeApp = async () => {
      unsubscribe = onIdTokenChanged(auth, async (user) => {
        const authStore = useAuthStore.getState();
        const skillStore = useSkillStore.getState();

        if (user) {
          try {
            await user.getIdToken();
            if (skillStore.skills.length > 0 && !skillStore.isSynced) {
              authStore.logIn({
                userId: user.uid,
                userEmail: user.email,
                userName: user.displayName,
                techStack: skillStore.skills,
              });
            } else {
              const fetchedSkills = await fetchUserSkills(user.uid);
              skillStore.setSkills(fetchedSkills);
              skillStore.toggleSync(true);
              authStore.logIn({
                userId: user.uid,
                userEmail: user.email,
                userName: user.displayName,
                techStack: fetchedSkills,
              });
            }
          } catch (error) {
            console.error(error);
            await signOut(auth);
            authStore.logOut();
            skillStore.clearLocalSkills();
          }
        } else {
          authStore.logOut();
          skillStore.clearLocalSkills();
        }
        authStore.setAuthInitialized(true);
      });
    };

    initializeApp();

    return () => {
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (state: AppStateStatus) => {
        if (state !== "active") return;
        const user = auth.currentUser;
        if (!user) return;

        await user.reload();

        useAuthStore.getState().refreshUser(user.email, user.displayName);
      },
    );

    return () => subscription.remove();
  }, []);
}
