import { router } from "expo-router";
import useAuthStore from "../../store/useAuthStore";
import useSkillStore from "../../store/useSkillStore";
import { db, auth } from "../../../config/FirebaseConfig";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { sc } from "../../constants/responsive";
import Toast from "react-native-toast-message";

export default async function handleDeleteAccount() {
  const user = auth.currentUser;
  if (!user) return;

  try {
    await deleteDoc(doc(db, "users", user.uid));
    await deleteUser(user);
    useAuthStore.getState().setOnboardingStatus(false);
    useAuthStore.getState().logOut();
    useSkillStore.getState().clearLocalSkills();
    Toast.show({
      type: "success",
      text1: "Account Deleted",
      text2: "Your data has been completely erased. We'll miss you!",
      topOffset: sc(45),
    });
  } catch (error: any) {
    if (error.code === "auth/requires-recent-login") {
      Toast.show({
        type: "info",
        text1: "Security Verification",
        text2: "Please sign in one more time to confirm account deletion",
        topOffset: sc(45),
      });

      useAuthStore.getState().logOut();
      useSkillStore.getState().clearLocalSkills();

      router.replace({
        pathname: "/(auth)/signIn",
        params: { afterReauth: "delete" },
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Deletion Failed",
        text2: "An unexpected error occurred. Please try again.",
        topOffset: sc(45),
      });
    }
  }
}
