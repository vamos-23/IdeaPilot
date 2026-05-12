import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../config/FirebaseConfig";

export async function syncBookmarks(
  userId: string,
  ideaId: string,
  isBookmarked: boolean,
): Promise<{ status: "bookmarked" | "unbookmarked" } | void> {
  if (!userId || !ideaId) return;

  const userRef = doc(db, "users", userId, "savedIdeas", ideaId);

  try {
    if (isBookmarked) {
      setDoc(
        userRef,
        {
          savedIdeas: ideaId,
        },
        { merge: true },
      );
      return { status: "bookmarked" };
    } else {
      deleteDoc(userRef);
      return { status: "unbookmarked" };
    }
  } catch (error) {
    console.error("Failed to initialize database upsert:", error);
    throw error;
  }
}
