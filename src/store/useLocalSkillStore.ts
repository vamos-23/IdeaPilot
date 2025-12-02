import { create } from "zustand";
import Skill from "../constants/types";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";

interface SkillStateLocal {
  skills: Skill[];
  hasHydrated: boolean;
  addSkill: (newSkill: Skill) => void;
  removeSkill: (skillID: string) => void;
  saveSkillsToFirebase: (userID: string) => void;
  clearLocalSkills: () => void;
}

const useLocalSkillStore = create<SkillStateLocal>()((set, get) => ({
  skills: [],
  hasHydrated: false,

  addSkill: (newSkill: Skill) => {
    const currentSkills = get().skills;
    set({ skills: [...currentSkills, newSkill] });
  },

  removeSkill: (skillID: string) => {
    const currentSkills = get().skills;
    const updatedSkills = currentSkills.filter((skill) => skill.id !== skillID);
    set({ skills: updatedSkills });
  },

  saveSkillsToFirebase: async (userID: string) => {
    const localSkills = get().skills;
    if (localSkills.length === 0) return;
    const userDocRef = doc(db, "users", userID);
    try {
      await setDoc(userDocRef, { skills: localSkills });
    } catch (error) {
      console.error("Error storing skills to Firebase!", error);
      throw error; //handled by signUp.tsx
    }
  },
  
  clearLocalSkills: () => {
    set({ skills: [] });
  },
}));
export default useLocalSkillStore;
