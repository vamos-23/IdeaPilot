import { create } from "zustand";
import Skill from "../constants/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SkillState {
  skills: Skill[];
  addSkill: (skill: Skill) => void;
  removeSkill: (skillId: string) => void;
}

const useSkillStore = create<SkillState>((set, get) => ({
  skills: [],
  addSkill: (skill) => {
    const currentSkills = get().skills;
    const updatedSkills = [...currentSkills, skill];
    set({ skills: updatedSkills });
  },
  removeSkill: (skillId) => {
    const currentSkills = get().skills;
    const updatedSkills = currentSkills.filter((skill) => skill.id !== skillId);
    set({ skills: updatedSkills });
  },
}));
export default useSkillStore;
