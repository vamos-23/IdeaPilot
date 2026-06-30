import { create } from "zustand";
import {
  fetchRecommendedIdeas,
  fetchAIIdeas,
  syncBookmarks,
} from "../services/ideas/ideas.service";
import { ProjectIdea, TabType } from "../constants/types";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Ideastate {
  recommendedIdeas: ProjectIdea[];
  bookmarkedIdeas: ProjectIdea[];
  aiIdeas: ProjectIdea[];
  bookmarkedIds: Record<string, boolean>;

  activeTab: TabType;
  loading: boolean;
  refreshing: boolean;
  refreshCount: number;
  lastRefreshTime: number | null;

  setActiveTab: (tab: TabType) => void;
  fetchInitialIdeas: (userId: string) => Promise<ProjectIdea[] | void>;
  refreshFeed: () => Promise<ProjectIdea[] | void>;
  refreshFeedRateLimiter: () => Promise<{
    allowed: boolean;
    reason?: "cooldown";
  }>;
  toggleBookmarkIdea: (
    idea: ProjectIdea,
    userId: string,
  ) => Promise<{
    result: "success" | "failure";
    action?: "bookmarked" | "unbookmarked";
  }>;
  saveLocalAIIdea: (newIdea: ProjectIdea) => void;
  removeLocalAIIdea: (ideaId: string) => void;
}

export const useIdeas = create<Ideastate>()(
  persist(
    (set, get) => ({
      recommendedIdeas: [],
      bookmarkedIdeas: [],
      bookmarkedIds: {},
      aiIdeas: [],
      activeTab: "discover",
      loading: true,
      refreshing: false,
      refreshCount: 0,
      lastRefreshTime: null,

      setActiveTab: (tab) => set({ activeTab: tab }),

      fetchInitialIdeas: async (userId: string) => {
        if (get().recommendedIdeas.length > 0 && get().aiIdeas.length > 0) {
          set({ loading: false });
          return;
        }

        const [globalIdeas, aiGeneratedIdeas] = await Promise.all([
          fetchRecommendedIdeas(),
          fetchAIIdeas(userId),
        ]);

        set({
          recommendedIdeas: globalIdeas || [],
          aiIdeas: aiGeneratedIdeas || [],
          loading: false,
        });
      },

      refreshFeed: async () => {
        set({
          refreshing: true,
        });
        const freshIdeas = await fetchRecommendedIdeas();
        set({
          recommendedIdeas: freshIdeas || [],
          refreshing: false,
        });
      },

      refreshFeedRateLimiter: async () => {
        const { lastRefreshTime, refreshFeed, activeTab } = get();
        if (activeTab !== "discover") {
          return { allowed: false };
        }
        const now = Date.now();
        const COOL_DOWN_TIME = 1000 * 60 * 2;

        if (lastRefreshTime && now - lastRefreshTime >= COOL_DOWN_TIME) {
          set({ refreshCount: 0, lastRefreshTime: null });
        }

        const currentCount = get().refreshCount;

        if (currentCount > 1) {
          return { allowed: false, reason: "cooldown" };
        }

        set((state) => ({
          refreshCount: state.refreshCount + 1,
          lastRefreshTime: now,
        }));

        await refreshFeed();
        return { allowed: true };
      },

      toggleBookmarkIdea: async (idea, userId) => {
        const isCurrentlyBookmarked = !!get().bookmarkedIds[idea.id];
        set((state) => {
          const newIds = { ...state.bookmarkedIds };
          if (isCurrentlyBookmarked) {
            delete newIds[idea.id];
          } else {
            newIds[idea.id] = true;
          }

          return {
            bookmarkedIds: newIds,
            bookmarkedIdeas: isCurrentlyBookmarked
              ? state.bookmarkedIdeas.filter((p) => p.id !== idea.id)
              : [idea, ...state.bookmarkedIdeas],
          };
        });

        try {
          const response = await syncBookmarks(
            userId,
            idea.id,
            !isCurrentlyBookmarked,
          );
          return { result: "success", action: response?.status };
        } catch {
          set((state) => ({
            bookmarkedIds: {
              ...state.bookmarkedIds,
              [idea.id]: isCurrentlyBookmarked,
            },
            bookmarkedIdeas: isCurrentlyBookmarked
              ? [idea, ...state.bookmarkedIdeas]
              : state.bookmarkedIdeas.filter((p) => p.id !== idea.id),
          }));
          return { result: "failure" };
        }
      },

      saveLocalAIIdea: (newIdea) => {
        set((state) => {
          const existingIndex = state.aiIdeas.findIndex(
            (idea) => idea.id === newIdea.id,
          );
          if (existingIndex !== -1) {
            const updatedIdeas = [...state.aiIdeas];
            updatedIdeas[existingIndex] = newIdea;
            console.log(state.aiIdeas);
            return { aiIdeas: updatedIdeas };
          } else {
            console.log(state.aiIdeas);
            return { aiIdeas: [newIdea, ...state.aiIdeas] };
          }
        });
      },

      removeLocalAIIdea: (ideaId: string) => {
        set((state) => {
          const { [ideaId]: _, ...remainingBookmarkedIds } =
            state.bookmarkedIds;
          return {
            aiIdeas: state.aiIdeas.filter((idea) => idea.id !== ideaId),
            bookmarkedIdeas: state.bookmarkedIdeas.filter(
              (idea) => idea.id !== ideaId,
            ),
            bookmarkedIds: remainingBookmarkedIds,
          };
        });
      },
    }),
    {
      name: "idea-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        bookmarkedIdeas: state.bookmarkedIdeas,
        bookmarkedIds: state.bookmarkedIds,
        aiIdeas: state.aiIdeas,
        lastRefreshTime: state.lastRefreshTime,
      }),
    },
  ),
);
