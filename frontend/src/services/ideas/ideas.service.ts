import {
  collection,
  query,
  orderBy,
  limit,
  startAt,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import { ProjectIdea } from "@/src/constants/types";

const FETCH_LIMIT = 25;
const jsonRegex = /```json_idea\b\s*([\s\S]*?)\s*```/i;

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
    const aiIdeasRef = collection(db, "users", userId, "ai-ideas");
    const snapshot = await getDocs(aiIdeasRef);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      isAIGenerated: true,
      ...doc.data(),
    })) as ProjectIdea[];
  } catch {
    return [];
  }
}

export async function fetchBookmarkedIdeas(
  userId: string,
): Promise<ProjectIdea[]> {
  try {
    const savedIdeasRef = collection(db, "users", userId, "savedIdeas");
    const snapshot = await getDocs(savedIdeasRef);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ProjectIdea[];
  } catch {
    return [];
  }
}

export function parseAIResponse(rawContent: string): {
  cleanText: string;
  projectData: Omit<ProjectIdea, "isAIGenerated" | "randomValue"> | null;
} {
  let projectData = null;
  const match = jsonRegex.exec(rawContent);

  if (match?.[1]) {
    try {
      const parsed = JSON.parse(match[1].trim());
      if (parsed && typeof parsed === "object" && "id" in parsed && parsed.id) {
        projectData = parsed;
      } else {
        console.warn(
          "Valid JSON received but id is missing. Rejecting project state.",
        );
      }
    } catch (err) {
      console.error("Failed to parse json_idea block:", err);
    }
  }

  const cleanText = rawContent
    .replace(jsonRegex, "")
    .replace(/^json_idea\s*$/gim, "")
    .replace(/^JSON Proposal.*$/gim, "")
    .replace(/^JSON Schema.*$/gim, "")
    .replace(/^Here's the JSON.*$/gim, "")
    .replace(/^Below is the schema.*$/gim, "")
    .trim();

  return {
    cleanText,
    projectData,
  };
}

export async function saveAIIdeasToVault(
  userId: string,
  ideaData: Omit<ProjectIdea, "isAIGenerated" | "randomValue">,
) {
  try {
    const completeAIIdea: ProjectIdea = {
      ...ideaData,
      isAIGenerated: true,
    };
    const aiIdeaRef = doc(db, "users", userId, "ai-ideas", ideaData.id);
    await setDoc(aiIdeaRef, completeAIIdea, { merge: true });
    return completeAIIdea;
  } catch {
    throw new Error("Something went wrong. Couldn't save the project.");
  }
}

export async function deleteAIIdeaFromVault(userId: string, aiIdeaId: string) {
  try {
    const aiIdeaRef = doc(db, "users", userId, "ai-ideas", aiIdeaId);
    const savedIdeaRef = doc(db, "users", userId, "savedIdeas", aiIdeaId);
    await Promise.all([deleteDoc(aiIdeaRef), deleteDoc(savedIdeaRef)]);
  } catch {
    throw new Error("Something went wrong. Couldn't delete the project.");
  }
}

export async function syncBookmarks(
  userId: string,
  ideaId: string,
  ideaData: ProjectIdea,
  isBookmarked: boolean,
): Promise<{ status: "bookmarked" | "unbookmarked" } | void> {
  if (!userId || !ideaId) return;

  const savedIdeaRef = doc(db, "users", userId, "savedIdeas", ideaId);

  try {
    if (isBookmarked) {
      await setDoc(savedIdeaRef, ideaData, { merge: true });
      return { status: "bookmarked" };
    } else {
      await deleteDoc(savedIdeaRef);
      return { status: "unbookmarked" };
    }
  } catch (error) {
    console.error("Failed to initialize database upsert:", error);
    throw error;
  }
}
