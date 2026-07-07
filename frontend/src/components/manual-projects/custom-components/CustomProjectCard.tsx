import { memo, useCallback } from "react";
import { Alert, Text, View, TouchableOpacity } from "react-native";
import { DIFFICULTY_STYLES } from "../../../constants/projectCardStyles/project-card-styles";
import { sc } from "../../../constants/responsive";
import { FetchedProjects } from "../../../constants/types";
import { useRouter } from "expo-router";
import { deleteProject } from "@/src/services/ideas/projects.service";
import useProjectStore from "@/src/store/useProjectStore";
import Toast from "react-native-toast-message";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";

type CustomProjectCardProps = {
  item: FetchedProjects;
  isDark: boolean;
  userId: string;
};

export const CustomProjectCard = memo(function CustomProjectCard({
  item,
  isDark,
  userId,
}: CustomProjectCardProps) {
  const router = useRouter();
  const removeProject = useProjectStore((s) => s.removeProject);

  const difficulty =
    DIFFICULTY_STYLES[item.difficulty as keyof typeof DIFFICULTY_STYLES] ||
    DIFFICULTY_STYLES.Intermediate;

  const handleNavigation = useCallback(() => {
    router.push(`/customProject/${item.id}`);
  }, [router, item.id]);

  const handleDeleteCustomProject = async () => {
    if (!userId) return;
    try {
      await deleteProject(userId, item.id);
      removeProject(item.id);

      Toast.show({
        type: "success",
        text1: "Project Deleted 🗑️",
        text2: `Removed ${item.projectName} from Project Workspace`,
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
      "Are you sure?",
      "You are going to delete your project idea. This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: handleDeleteCustomProject,
        },
      ],
    );
  };
  const visibleTech = item.technologies.slice(0, 3);
  const extraTechCount = item.technologies.length - visibleTech.length;

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
        <View className="items-center">
          <TouchableOpacity
            activeOpacity={0.7}
            hitSlop={20}
            onPress={handleDelete}
          >
            <Feather
              name="trash-2"
              size={21}
              color={isDark ? "#f74343" : "#DC2626"}
            />
          </TouchableOpacity>
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
          {item.projectName}
        </Text>
      </View>

      <View className="flex-row flex-wrap gap-2 mt-3">
        {visibleTech.map((tech) => (
          <View
            key={tech}
            className="px-2 py-1 rounded-lg bg-blue-300/20 dark:bg-orange-600/10 border border-blue-300 dark:border-orange-500/20"
          >
            <Text
              className="font-nata-sans-bold text-blue-600 dark:text-orange-400 text-[10px] uppercase tracking-wide"
              numberOfLines={1}
            >
              {tech}
            </Text>
          </View>
        ))}

        {extraTechCount > 0 && (
          <View className="justify-center ml-1">
            <Text className="text-blue-950 dark:text-slate-500 font-nata-sans-bold text-[10px] uppercase ml-1 tracking-wide">
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
          hitSlop={20}
          onPress={handleNavigation}
          className="bg-orange-600/10 dark:bg-orange-500/10 p-1.5 rounded-full"
        >
          <Feather name="chevron-right" size={18} color="#ea580c" />
        </TouchableOpacity>
      </View>
    </View>
  );
});
