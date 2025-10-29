import { create } from "zustand";
import Skill from "../constants/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SkillState {
  skills: Skill[];
  addSkill: (skill: Skill) => void;
  removeSkill: (skillId: string) => void;
  _saveToStorage: (skill: Skill[]) => void;
  loadSkills: () => Promise<void>;
}
const SKILL_STORAGE_KEY = "user-skills";

const useSkillStore = create<SkillState>((set, get) => ({
  skills: [],
  _saveToStorage: (skills) => {
    AsyncStorage.setItem(SKILL_STORAGE_KEY, JSON.stringify(skills));
  },
  addSkill: (skill) => {
    const currentSkills = get().skills;
    const updatedSkills = [...currentSkills, skill];
    set({ skills: updatedSkills });
    get()._saveToStorage(updatedSkills);
  },
  removeSkill: (skillId) => {
    const currentSkills = get().skills;
    const updatedSkills = currentSkills.filter((skill) => skill.id !== skillId);
    set({ skills: updatedSkills });
    get()._saveToStorage(updatedSkills);
  },
  loadSkills: async () => {
    try {
      const savedSkills = await AsyncStorage.getItem(SKILL_STORAGE_KEY);
      if (savedSkills !== null) {
        set({ skills: JSON.parse(savedSkills) });
      }
    } catch (e) {
      console.error("Failed to load user skills!", e);
    }
  },
}));
export default useSkillStore;
