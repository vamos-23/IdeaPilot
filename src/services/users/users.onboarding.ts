import Skill from "../../constants/types";
import { db } from "@/config/FirebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

export async function syncSkills(uid: string, skills: Skill[]) {
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, { techStack: skills }, { merge: true });
    return { success: true, message: "Skills synced successfully!" };
  } catch (error) {
    console.error("Error syncing skills:", error);
    return { success: false, message: "Failed to sync skills" };
  }
}

export async function fetchUserSkills(uid: string): Promise<Skill[]> {
  try {
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists() && docSnap.data().techStack) {
      return docSnap.data().techStack;
    }
    return [];
  } catch (error) {
    console.error("Error fetching user skills:", error);
    return [];
  }
}
