import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProjectIdea } from "../constants/types";

interface FeaturedProjectState {
  savedWeek: number | null;
  featuredProject: ProjectIdea | null;
  calculateFeaturedProject: (ideas: ProjectIdea[]) => void;
}

export const useFeaturedProject = create<FeaturedProjectState>()(
  persist(
    (set, get) => ({
      savedWeek: null,
      featuredProject: null,

      calculateFeaturedProject: (ideas) => {
        if (!ideas || ideas.length === 0) return;
        const currentWeek = Math.floor(Date.now() / 604800000); //1000 * 60 * 60 * 24 * 7
        const { savedWeek, featuredProject } = get();
        if (savedWeek === currentWeek && featuredProject) {
          return;
        }
        const newFeaturedProject = ideas[currentWeek % ideas.length];
        set({
          savedWeek: currentWeek,
          featuredProject: newFeaturedProject,
        });
      },
    }),
    {
      name: "featured-project-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
