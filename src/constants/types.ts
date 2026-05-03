export default interface Skill {
  id: string;
  stackName: string;
  category?: string;
}
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface ProjectIdea {
  id: string;
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

export interface Stats {
  title: string;
  value: number;
  textColor: string;
  icon: React.ReactNode;
}
