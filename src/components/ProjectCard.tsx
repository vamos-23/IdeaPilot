import { Text, View, TouchableOpacity } from "react-native";
import { DIFFICULTY_STYLES } from "../constants/projectCardStyles/project-card-styles";
import { sc } from "../constants/responsive";
import { ProjectIdea } from "../constants/types";
import { useRouter } from "expo-router";
import { Clock, Box, ChevronRight } from "lucide-react-native";
import { memo } from "react";
import useThemeStore from "@/src/store/useThemeStore";

export const ProjectCard = memo(function ProjectCard({
  item,
}: {
  item: ProjectIdea;
}) {
  const router = useRouter();
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const difficulty =
    DIFFICULTY_STYLES[item.difficulty as keyof typeof DIFFICULTY_STYLES] ||
    DIFFICULTY_STYLES.Intermediate;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.push(`/project/${item.id}`)}
      className="p-5 mb-5 rounded-[32px] border border-blue-400/30 dark:border-orange-500/60 bg-cardLight dark:bg-cardDark"
    >
      <View className="flex-row justify-between items-center mb-4">
        <View
          className={`px-3 py-1 rounded-full border ${difficulty.border} ${difficulty.bg}`}
        >
          <Text
            className={`font-nata-sans-bold text-[10px] uppercase tracking-widest ${difficulty.text}`}
          >
            {difficulty.label}
          </Text>
        </View>
        <View className="flex-row items-center border border-blue-400/20 dark:border-gray-500/30 bg-blue-200/50 dark:bg-brandDark px-3 py-1.5 rounded-full">
          <Clock
            size={12}
            color={isDark ? "#cbd5e1" : "#1E3A8A"}
            strokeWidth={2.5}
          />
          <Text className="text-blue-900 dark:text-slate-300 font-nata-sans-bold text-[10px] ml-1.5 uppercase">
            {item.estimatedTime}
          </Text>
        </View>
      </View>

      <View className="gap-y-1">
        <Text
          className="font-nata-sans-bold text-blue-950 dark:text-white"
          style={{ fontSize: sc(21) }}
        >
          {item.name}
        </Text>
        <Text
          className="font-nata-sans-medium text-blue-800 dark:text-slate-400 leading-6"
          style={{ fontSize: sc(13) }}
        >
          {item.description}
        </Text>
      </View>

      <View className="flex-row flex-wrap gap-2 mt-5">
        {item.techStack.slice(0, 3).map((tech) => (
          <View
            key={tech}
            className="px-3 py-1.5 rounded-xl bg-blue-300/40 dark:bg-orange-600/20 border border-blue-400/30 dark:border-orange-500"
          >
            <Text className="font-nata-sans-bold text-blue-900 dark:text-orange-400 text-[10px] uppercase">
              {tech}
            </Text>
          </View>
        ))}
        {item.techStack.length > 3 && (
          <View className="justify-center ml-1">
            <Text className="text-blue-700/60 dark:text-slate-500 font-nata-sans-bold text-[10px] uppercase">
              +{item.techStack.length - 3} MORE
            </Text>
          </View>
        )}
      </View>

      <View className="flex-row items-center justify-between mt-6 pt-4 border-t border-blue-400/10 dark:border-white/5">
        <View className="flex-row items-center">
          <Box size={16} color="#ea580c" strokeWidth={2} />
          <Text className="font-nata-sans-bold ml-2 uppercase text-[11px] text-orange-600 dark:text-orange-500">
            {item.category}
          </Text>
        </View>
        <View className="bg-orange-600/10 dark:bg-orange-500/10 p-1.5 rounded-full">
          <ChevronRight size={16} color="#ea580c" />
        </View>
      </View>
    </TouchableOpacity>
  );
});
