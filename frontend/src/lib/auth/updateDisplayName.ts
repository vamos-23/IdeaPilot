import { updateProfile } from "firebase/auth";
import { auth } from "../../../config/FirebaseConfig";
import useAuthStore from "@/src/store/useAuthStore";
import useSkillStore from "@/src/store/useSkillStore";

export const updateDisplayName = async (newName: string) => {
  const user = auth.currentUser;
  if (!newName || newName.trim() === "") {
    throw new Error("Display name cannot be empty!");
  }
  if (!user) throw new Error("No user logged in!");
  try {
    await updateProfile(user, { displayName: newName });
    useAuthStore.getState().logIn({
      userId: user.uid,
      userName: newName,
      userEmail: user.email,
      techStack: useSkillStore.getState().skills,
    });
    return true;
  } catch (error) {
    console.log("Error updating display name!");
    throw error;
  }
};
