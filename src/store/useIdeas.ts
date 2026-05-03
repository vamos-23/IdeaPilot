import { create } from "zustand";
import { fetchRandomIdeas } from "../services/ideas/ideas.service";
import { ProjectIdea } from "../constants/types";

interface IdeaState {
  ideas: ProjectIdea[];
  loading: boolean;
  refreshing: boolean;
  fetchInitialIdeas: () => Promise<ProjectIdea[] | void>;
  refreshIdeas: () => Promise<ProjectIdea[] | void>;
}

export const useIdeas = create<IdeaState>((set, get) => ({
  ideas: [],
  loading: false,
  refreshing: false,

  fetchInitialIdeas: async () => {
    if (get().ideas.length > 0) return;

    set({ loading: true });

    const ideas = await fetchRandomIdeas();
    if (!ideas) return [];
    set({
      ideas,
      loading: false,
    });
  },

  refreshIdeas: async () => {
    set({
      refreshing: true,
    });

    const ideas = await fetchRandomIdeas();
    if (!ideas) return [];
    set({
      ideas,
      refreshing: false,
    });
  },
}));
