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

export async function fetchRandomIdeas(): Promise<ProjectIdea[]> {
  const ideasRef = collection(db, "project-ideas");
  const random = Math.random();

  const q = query(ideasRef, orderBy("randomValue"), startAt(random), limit(6));

  let snapshot = await getDocs(q);

  if (snapshot.docs.length < 6) {
    const fallBackQuery = query(ideasRef, orderBy("randomValue"), limit(6));
    snapshot = await getDocs(fallBackQuery);
  }

  return snapshot.docs.map((doc) => {
    const data = doc.data() as ProjectIdea;
    return {
      ...data,
      id: doc.id,
    };
  });
}
