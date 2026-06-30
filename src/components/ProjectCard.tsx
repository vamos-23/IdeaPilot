import { Alert, Text, View, TouchableOpacity } from "react-native";
import { DIFFICULTY_STYLES } from "../constants/projectCardStyles/project-card-styles";
import { sc } from "../constants/responsive";
import { ProjectIdea } from "../constants/types";
import { useRouter } from "expo-router";
import { memo, useCallback } from "react";
import Toast from "react-native-toast-message";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import { deleteAIIdeaFromVault } from "../services/ideas/ideas.service";
import { AnimatedBookmarkCheck } from "../animations/components/projectCards/AnimatedBookmarkCheck";
import { useIdeas } from "../store/useIdeas";

type ProjectCardProps = {
  item: ProjectIdea;
  isDark: boolean;
  userId: string;
  toggleBookmark: (
    item: ProjectIdea,
    userId: string,
  ) => Promise<{
    result: "success" | "failure";
    action?: "bookmarked" | "unbookmarked";
  }>;
};

export const ProjectCard = memo(function ProjectCard({
  item,
  isDark,
  userId,
  toggleBookmark,
}: ProjectCardProps) {
  const router = useRouter();
  const removeLocalAIIdea = useIdeas((state) => state.removeLocalAIIdea);
  const bookmarkedIdeas = useIdeas((state) => state.bookmarkedIdeas);
  const isBookmarked = useIdeas((state) => !!state.bookmarkedIds[item.id]);

  const difficulty =
    DIFFICULTY_STYLES[item.difficulty as keyof typeof DIFFICULTY_STYLES] ||
    DIFFICULTY_STYLES.Intermediate;

  const handleBookmark = useCallback(async () => {
    if (userId) {
      const response = await toggleBookmark(item, userId);
      const bookmarkingStatus = response?.action;
      if (response.result === "success") {
        Toast.show({
          type: "success",
          text1: "Project Saved! 🎉",
          text2: `Your project was ${bookmarkingStatus === "bookmarked" ? "bookmarked" : "unbookmarked"} successfully!!`,
        });
      } else if (response.result === "failure") {
        Toast.show({
          type: "error",
          text1: "Uggh! 😖",
          text2: "Something went wrong and we couldn't bookmark the project.",
        });
      }
    }
  }, [userId, item, toggleBookmark]);

  const handleNavigation = useCallback(() => {
    router.push(`/project/${item.id}`);
  }, [router, item.id]);

  const handleDeleteAIIdea = async () => {
    if (!userId) return;
    try {
      await deleteAIIdeaFromVault(userId, item.id);
      removeLocalAIIdea(item.id);
      
      Toast.show({
        type: "success",
        text1: "Project Deleted 🗑️",
        text2: `Removed ${item.name} from AI Vault`,
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Deletion Failed 😖",
        text2:
          error instanceof Error
            ? error.message
            : "Something went wrong. Try again later.",
      });
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Are you sure",
      "You are going to delete your AI-generated idea. This will delete it from the AI Vault but you can always add it back from the preview in your chats.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: handleDeleteAIIdea,
        },
      ],
    );
  };
  const visibleTech = item.techStack.slice(0, 3);
  const extraTechCount = item.techStack.length - 3;

  return (
    <View className="p-4 rounded-2xl border border-blue-500/10 dark:border-orange-500/20 bg-cardLight dark:bg-cardDark">
      <View className="flex-row justify-between items-start mb-2">
        <View
          className={`px-3 py-1 rounded-full border ${difficulty.border} ${difficulty.bg}`}
        >
          <Text
            className={`font-nata-sans-bold text-[10px] uppercase tracking-widest ${difficulty.text}`}
          >
            {difficulty.label}
          </Text>
        </View>
        <View className="flex-row gap-2 items-center">
          {item.isAIGenerated && (
            <TouchableOpacity
              activeOpacity={0.7}
              hitSlop={20}
              onPress={handleDelete}
            >
              <Feather
                name="trash"
                size={21}
                color={isDark ? "#f74343" : "#DC2626"}
              />
            </TouchableOpacity>
          )}
          <AnimatedBookmarkCheck
            isBookmarked={isBookmarked}
            onPress={handleBookmark}
            isDark={isDark}
          />
        </View>
      </View>

      <View className="gap-y-2">
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className="font-nata-sans-bold text-blue-950 dark:text-white"
          style={{
            fontSize: sc(17),
          }}
        >
          {item.name}
        </Text>
      </View>

      <View className="flex-row flex-wrap gap-2 mt-3">
        {visibleTech.map((tech) => (
          <View
            key={tech}
            className="px-2 py-1 rounded-lg bg-blue-300/20 dark:bg-orange-600/10 border border-blue-400/10 dark:border-orange-500/20"
          >
            <Text
              className="font-nata-sans-bold text-blue-900 dark:text-orange-400 text-[9px] uppercase"
              numberOfLines={1}
            >
              {tech}
            </Text>
          </View>
        ))}

        {extraTechCount > 0 && (
          <View className="justify-center ml-1">
            <Text className="text-blue-700/60 dark:text-slate-500 font-nata-sans-bold text-[10px] uppercase">
              +{extraTechCount} MORE
            </Text>
          </View>
        )}
      </View>

      <View className="flex-row items-center justify-between mt-3 pt-4 border-t border-blue-400/5 dark:border-white/5">
        <View className="flex-row items-center">
          <Ionicons name="cube-outline" size={15} color="#ea580c" />

          <Text className="font-nata-sans-bold ml-2 uppercase text-[11px] text-orange-600 dark:text-orange-500">
            {item.category}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleNavigation}
          className="bg-orange-600/10 dark:bg-orange-500/10 p-1.5 rounded-full"
        >
          <Feather name="chevron-right" size={18} color="#ea580c" />
        </TouchableOpacity>
      </View>
    </View>
  );
});
