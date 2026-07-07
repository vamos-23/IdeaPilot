import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../config/FirebaseConfig";
import { ProjectDetails, FetchedProjects } from "../../constants/types";

export async function createProject(
  userId: string,
  project: Omit<ProjectDetails, "id" | "createdAt" | "updatedAt">,
): Promise<ProjectDetails> {
  try {
    const projectRef = collection(db, "users", userId, "custom-projects");
    const projectRefDoc = doc(projectRef);
    const completeProjectIdea = {
      ...project,
      id: projectRefDoc.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(projectRefDoc, completeProjectIdea);
    return completeProjectIdea as ProjectDetails;
  } catch (error) {
    console.error("Failed to save project to Firestore:", error);
    throw new Error("Project couldn't be created. Try again later.");
  }
}

export async function deleteProject(
  userId: string,
  projectId: string,
): Promise<void> {
  try {
    const projectRef = doc(db, "users", userId, "custom-projects", projectId);
    await deleteDoc(projectRef);
  } catch (error) {
    console.warn("Failed to delete project:", error);
    throw new Error("Project couldn't be deleted. Try again later.");
  }
}

export async function fetchProjects(
  userId: string,
): Promise<FetchedProjects[]> {
  try {
    const projectsRef = collection(db, "users", userId, "custom-projects");
    const snapshot = await getDocs(
      query(projectsRef, orderBy("createdAt", "desc")),
    );
    return snapshot.docs.map((doc) => {
      const { createdAt, updatedAt, ...project } = doc.data() as ProjectDetails;
      return project;
    });
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
}

export async function updateProject(
  userId: string,
  projectId: string,
  updates: Partial<FetchedProjects>,
) {
  try {
    const projectRef = doc(db, "users", userId, "custom-projects", projectId);
    await updateDoc(projectRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error(
      `Failed to update project with projectId: ${projectId}:`,
      error,
    );
    throw new Error("Project couldn't be updated. Try again later.");
  }
}
