import { create } from "zustand";
import {
  fetchRecommendedIdeas,
  fetchAIIdeas,
  syncBookmarks,
  fetchBookmarkedIdeas,
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
  hasFetched: boolean;
  refreshing: boolean;
  refreshCount: number;
  lastRefreshTime: number | null;

  setActiveTab: (tab: TabType) => void;
  fetchInitialIdeas: (userId: string) => Promise<void>;
  clearIdeas: () => void;
  reset: () => void;
  refreshFeed: (userId: string) => Promise<void>;
  refreshFeedRateLimiter: (userId: string) => Promise<{
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

const initialState = {
  recommendedIdeas: [],
  bookmarkedIdeas: [],
  bookmarkedIds: {},
  aiIdeas: [],
  activeTab: "discover" as TabType,
  loading: true,
  hasFetched: false,
  refreshing: false,
  refreshCount: 0,
  lastRefreshTime: null as number | null,
};

export const useIdeas = create<Ideastate>()(
  persist(
    (set, get) => ({
      ...initialState,

      setActiveTab: (tab) => set({ activeTab: tab }),

      fetchInitialIdeas: async (userId: string) => {
        if (get().hasFetched) return;
        set({ loading: true });

        const [globalIdeas, userBookmarkedIdeas, aiGeneratedIdeas] =
          await Promise.all([
            fetchRecommendedIdeas(),
            fetchBookmarkedIdeas(userId),
            fetchAIIdeas(userId),
          ]);

        set({
          recommendedIdeas: globalIdeas ?? [],
          bookmarkedIdeas: userBookmarkedIdeas ?? [],
          aiIdeas: aiGeneratedIdeas ?? [],
          loading: false,
          hasFetched: true,
        });
      },

      refreshFeed: async (userId: string) => {
        const { activeTab } = get();
        set({
          refreshing: true,
        });

        if (activeTab === "bookmarked") {
          const freshBookmarkedIdeas = await fetchBookmarkedIdeas(userId);
          const ideas = freshBookmarkedIdeas || [];
          set({
            bookmarkedIdeas: ideas,
            refreshing: false,
          });
        } else if (activeTab === "ai") {
          const freshAIIdeas = await fetchAIIdeas(userId);
          const ideas = freshAIIdeas || [];
          set({
            aiIdeas: ideas,
            refreshing: false,
          });
        } else {
          const freshIdeas = await fetchRecommendedIdeas();
          const ideas = freshIdeas || [];
          set({
            recommendedIdeas: ideas,
            refreshing: false,
          });
        }
      },

      refreshFeedRateLimiter: async (userId: string) => {
        const { lastRefreshTime, refreshFeed } = get();
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

        await refreshFeed(userId);
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
            idea,
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

      clearIdeas: () =>
        set({
          recommendedIdeas: [],
          bookmarkedIdeas: [],
          bookmarkedIds: {},
          aiIdeas: [],
          activeTab: "discover",
          loading: true,
          refreshing: false,
          refreshCount: 0,
          lastRefreshTime: null,
          hasFetched: false,
        }),

      reset: () =>
        set({
          ...initialState,
        }),
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
