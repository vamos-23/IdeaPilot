import {
  KeyboardChatScrollView,
  type KeyboardChatScrollViewProps,
} from "react-native-keyboard-controller";
import { ScrollViewProps } from "react-native";
import { Timestamp } from "firebase/firestore";

//Default / Pre-defined project types
export default interface Skill {
  id: string;
  stackName: string;
  category?: string;
}

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type TabType = "discover" | "bookmarked" | "ai";
export type SaveStatus = "saving" | "saved" | "updated" | "idle";

export interface ProjectIdea {
  id: string;
  projectPreviewId?: string;
  isAIGenerated?: boolean;
  category: string;
  description: string;
  difficulty: Difficulty;
  domain: string;
  estimatedTime: string;
  name: string;
  randomValue?: number;
  techStack: string[];
  detailedDescription: string;
  whatYouWillLearn: string[];
}

//AI Chat Screen types
export interface Chat {
  id: string;
  title: string;
  isPinned: boolean;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export interface MessagePage {
  messages: Message[];
  nextCursor: string | null;
  latestPreviewId: string | null;
}

export interface MenuState {
  visible: boolean;
  chatId: string | null;
  isPinned: boolean;
  currentTitle: string;
  x: number;
  y: number;
}

export interface ChatRenameState {
  visible: boolean;
  chatId: string | null;
  text: string;
}

export type ChatScrollViewRef = React.ComponentRef<
  typeof KeyboardChatScrollView
>;

export type ChatScrollViewProps = ScrollViewProps &
  KeyboardChatScrollViewProps & {
    chatScrollViewRef?: React.RefObject<ChatScrollViewRef | null>;
  };

//Custom project screen types
export interface ProjectDetails {
  id: string;
  projectName: string;
  category: string;
  description: string;
  detailedDescription: string;
  difficulty: Difficulty;
  domain: string;
  estimatedTime: string;
  technologies: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type FetchedProjects = Omit<ProjectDetails, "createdAt" | "updatedAt">;
export type DraftProject = Omit<
  ProjectDetails,
  "id" | "createdAt" | "updatedAt"
>;

//Project Resources types
export interface VideoTutorial {
  id: string;
  title: string;
  channelName: string;
  thumbnailUrl: string;
  videoUrl: string;
}

export interface Repository {
  id: string;
  avatarUrl: string;
  name: string;
  fullName: string;
  description: string;
  stars: string;
  watchers: string;
  forks: string;
  repoUrl: string;
}