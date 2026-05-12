export default interface Skill {
  id: string;
  stackName: string;
  category?: string;
}

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type TabType = "discover" | "bookmarked" | "ai";

export interface ProjectIdea {
  id: string;
  isAIGenerated?: boolean;
  category: string;
  description: string;
  difficulty: Difficulty;
  domain: string;
  estimatedTime: string;
  isTrending: boolean;
  name: string;
  randomValue: number;
  techStack: string[];
  detailedDescription: string;
  whatYouWillLearn: string[];
}

