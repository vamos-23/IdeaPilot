import { create } from "zustand";
import { ProjectDetails, DraftProject } from "../constants/types";

const INITIAL_PROJECT: DraftProject = {
  projectName: "",
  category: "",
  estimatedTime: "",
  domain: "",
  difficulty: "Beginner",
  description: "",
  detailedDescription: "",
  technologies: [],
};

type CreateProject = {
  project: DraftProject;
  update: (values: Partial<DraftProject>) => void;
  reset: () => void;
};

const useCreateProjectStore = create<CreateProject>((set) => ({
  project: INITIAL_PROJECT,
  update: (values: Partial<ProjectDetails>) =>
    set((state) => ({ project: { ...state.project, ...values } })),
  reset: () =>
    set({
      project: INITIAL_PROJECT,
    }),
}));

export default useCreateProjectStore;
