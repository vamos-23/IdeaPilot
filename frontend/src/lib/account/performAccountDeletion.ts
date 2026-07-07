import { auth, db } from "@/config/FirebaseConfig";
import { deleteUser } from "firebase/auth";
import { collection, doc, getDocs, writeBatch } from "firebase/firestore";
import Toast from "react-native-toast-message";
import { sc } from "@/src/constants/responsive";
import useAuthStore from "@/src/store/useAuthStore";
import useProjectStore from "@/src/store/useProjectStore";
import useSkillStore from "@/src/store/useSkillStore";
import useThemeStore from "@/src/store/useThemeStore";
import { useIdeas } from "@/src/store/useIdeas";

export default async function performAccountDeletion() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No authenticated user.");
  }

  try {
    const batch = writeBatch(db);
    const subCollections = ["ai-ideas", "custom-projects", "savedIdeas"];
    for (const subCollection of subCollections) {
      const subRef = collection(db, "users", user.uid, subCollection);
      const snapshot = await getDocs(subRef);
      snapshot.forEach((subDoc) => {
        batch.delete(subDoc.ref);
      });
    }

    batch.delete(doc(db, "users", user.uid));
    await batch.commit();

    await deleteUser(user);

    await Promise.all([
      useAuthStore.persist.clearStorage(),
      useSkillStore.persist.clearStorage(),
      useProjectStore.persist.clearStorage(),
      useIdeas.persist.clearStorage(),
      useThemeStore.persist.clearStorage(),
    ]);

    useAuthStore.getState().reset();
    useSkillStore.getState().reset();
    useProjectStore.getState().reset();
    useIdeas.getState().reset();
    useThemeStore.getState().reset();

    Toast.show({
      type: "success",
      text1: "Account Deleted",
      text2: "Your data has been erased. We'll miss you!",
      topOffset: sc(45),
    });
  } catch (error) {
    console.error("Account deletion failed:", error);

    Toast.show({
      type: "error",
      text1: "Deletion Failed",
      text2: "An unexpected error occurred. Please try again.",
      topOffset: sc(45),
    });

    throw error;
  }
}
