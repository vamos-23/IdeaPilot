import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { FetchedProjects } from "../constants/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchProjects } from "../services/ideas/projects.service";

type ProjectStore = {
  projects: FetchedProjects[];
  loading: boolean;
  hasFetched: boolean;
  fetchCustomProjects: (userId: string) => Promise<void>;
  addProject: (project: FetchedProjects) => void;
  removeProject: (projectId: string) => void;
  updateProjectsOnEdit: (
    projectId: string,
    updates: Partial<FetchedProjects>,
  ) => void;
  clearProjects: () => void;
  reset: () => void;
};

const initialState = {
  projects: [] as FetchedProjects[],
  loading: true,
  hasFetched: false,
};

const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      fetchCustomProjects: async (userId: string) => {
        if (get().hasFetched) return;
        set({ loading: true });

        const customProjects = await fetchProjects(userId);
        set({
          projects: customProjects,
          loading: false,
          hasFetched: true,
        });
      },

      addProject: (project) =>
        set((state) => ({
          projects: [project, ...state.projects],
        })),

      removeProject: (projectId) =>
        set((state) => ({
          projects: state.projects.filter(
            (project) => project.id !== projectId,
          ),
        })),

      updateProjectsOnEdit: (projectId, updates) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId ? { ...project, ...updates } : project,
          ),
        }));
      },

      clearProjects: () =>
        set({
          projects: [],
          loading: true,
          hasFetched: false,
        }),

      reset: () =>
        set({
          ...initialState,
        }),
    }),
    {
      name: "workspace-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        projects: state.projects,
      }),
    },
  ),
);

export default useProjectStore;
