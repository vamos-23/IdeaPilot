import {
  KeyboardChatScrollView,
  type KeyboardChatScrollViewProps,
} from "react-native-keyboard-controller";
import { ScrollViewProps } from "react-native";

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
