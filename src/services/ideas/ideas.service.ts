import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAt,
} from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import { ProjectIdea } from "@/src/constants/types";

const FETCH_LIMIT = 25;
export async function fetchRecommendedIdeas(): Promise<ProjectIdea[]> {
  try {
    const recommended_ideasRef = collection(db, "project-ideas");
    const random = Math.random();

    const q = query(
      recommended_ideasRef,
      orderBy("randomValue"),
      startAt(random),
      limit(FETCH_LIMIT),
    );

    let snapshot = await getDocs(q);

    if (snapshot.docs.length < FETCH_LIMIT) {
      const fallBackQuery = query(
        recommended_ideasRef,
        orderBy("randomValue"),
        limit(FETCH_LIMIT),
      );
      snapshot = await getDocs(fallBackQuery);
    }

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ProjectIdea[];
  } catch {
    return [];
  }
}

export async function fetchAIIdeas(userId: string): Promise<ProjectIdea[]> {
  try {
    const ai_ideasRef = collection(db, "users", userId, "ai-ideas");
    const snapshot = await getDocs(ai_ideasRef);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      isAIGenerated: true,
      ...doc.data(),
    })) as ProjectIdea[];
  } catch {
    return [];
  }
}
