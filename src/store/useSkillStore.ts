import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import Skill from "../constants/types";

interface SkillState {
  skills: Skill[];
  hasHydrated: boolean;
  isSynced: boolean;

  setSkills: (skills: Skill[]) => void;
  addSkill: (newSkill: Skill) => void;
  removeSkill: (skillID: string) => void;
  markSynced: () => void;
  markUnsynced: () => void;
  clearLocalSkills: () => void;
}

const useSkillStore = create<SkillState>()(
  persist(
    (set) => ({
      skills: [],
      isSynced: false,
      hasHydrated: false,

      setSkills: (skills: Skill[]) =>
        set({
          skills,
          isSynced: false,
        }),

      addSkill: (newSkill: Skill) =>
        set((state) => ({
          skills: [...state.skills, newSkill],
          isSynced: false,
        })),

      removeSkill: (skillID: string) =>
        set((state) => ({
          skills: state.skills.filter((s) => s.id !== skillID),
          isSynced: false,
        })),

      markSynced: () => set({ isSynced: true }),

      markUnsynced: () => set({ isSynced: false }),

      clearLocalSkills: () => {
        set({
          skills: [],
          isSynced: false,
        });
      },
    }),
    {
      name: "user-skills",
      storage: createJSONStorage(() => AsyncStorage),

      onRehydrateStorage: (state) => {
        if (state) {
          state.hasHydrated = true;
        }
      },
    },
  ),
);
export default useSkillStore;
