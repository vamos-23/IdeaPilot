import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { ProjectIdea, SaveStatus } from "@/src/constants/types";
import { useRouter } from "expo-router";
import { ThemeMode } from "@/src/store/useThemeStore";
import { useCallback, useMemo } from "react";
import Animated, {
  FadeInLeft,
  FadingTransition,
} from "react-native-reanimated";
import { DIFFICULTY_STYLES } from "@/src/constants/projectCardStyles/project-card-styles";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";

type ProjectBluePrintProps = {
  data: Omit<ProjectIdea, "isAIGenerated" | "randomValue">;
  onSave: () => void;
  saveStatus: SaveStatus;
  isLatest: boolean;
  isProjectInVault: boolean;
  isUptoDate: boolean;
  theme: ThemeMode;
};

export default function ProjectBluePrint({
  data,
  onSave,
  saveStatus,
  isLatest,
  isProjectInVault,
  isUptoDate,
  theme,
}: ProjectBluePrintProps) {
  const router = useRouter();
  const { diffStyle } = useMemo(() => {
    const diffKey =
      (data?.difficulty as keyof typeof DIFFICULTY_STYLES) || "Beginner";
    const style = DIFFICULTY_STYLES[diffKey] || DIFFICULTY_STYLES["Beginner"];
    return { diffStyle: style };
  }, [data]);

  const handleRouteToDetailedScreen = useCallback(() => {
    if (data.id) {
      router.push(`/project/${data.id}`);
    }
  }, [data.id, router]);

  const buttonText = useMemo(() => {
    if (!isLatest) return "Superseded Version";
    if (saveStatus === "saved") return "Saved to AI Vault";
    if (saveStatus === "updated") return "Updated AI Vault";
    if (isProjectInVault && isUptoDate) return "Saved to AI Vault";
    if (isProjectInVault) return "Update AI Vault";
    return "Save to AI Vault";
  }, [isLatest, isProjectInVault, isUptoDate, saveStatus]);

  const isButtonDisabled =
    saveStatus === "saving" ||
    saveStatus === "saved" ||
    saveStatus === "updated" ||
    isUptoDate ||
    !isLatest;

  return (
    <Animated.View
      layout={FadingTransition.delay(80)}
      className="bg-white border border-violet-300 dark:bg-[#0F172A] dark:border-[#2d323a] p-5 rounded-2xl
      "
    >
      <View className="flex-row items-start justify-between border-b border-slate-200 pb-5 dark:border-[#324166]">
        <View className="mr-4 flex-1 gap-3">
          <View>
            <Text className="text-xl font-nata-sans-bold text-textLight dark:text-slate-50">
              {data.name}
            </Text>
            {!isLatest && (
              <View className="mt-2 self-start rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <Text className="text-[10px] font-nata-sans-bold tracking-wider text-slate-500 dark:text-slate-400">
                  NEWER VERSION BELOW
                </Text>
              </View>
            )}
          </View>
          <View className="flex-row flex-wrap items-center gap-2">
            <View
              className={`rounded-full border px-3 py-1.5 ${diffStyle.bg} ${diffStyle.border}`}
            >
              <Text
                className={`text-[9px] font-nata-sans-bold uppercase tracking-wider ${diffStyle.text}`}
              >
                {diffStyle.label}
              </Text>
            </View>

            <View className="flex-row items-center gap-1 rounded-full border border-cyan-500/60 bg-cyan-500/10 px-3 py-1.5 dark:border-cyan-400/70">
              <MaterialCommunityIcons
                name="clock-outline"
                size={12}
                color={theme === "light" ? "#06B6D4B3" : "#22D3EE"}
              />

              <Text className="text-[9px] font-nata-sans-bold uppercase tracking-wider text-cyan-500/70 dark:text-cyan-400">
                {data.estimatedTime}
              </Text>
            </View>
          </View>

          <Text className="flex-1 text-md font-nata-sans-medium text-slate-600 dark:text-slate-300">
            {data.description}
          </Text>
        </View>

        <View className="h-10 w-10 items-center justify-center rounded-xl border border-orange-200 bg-orange-50 dark:border-[#37456E] dark:bg-[#2A3156]">
          <MaterialCommunityIcons
            name="lightbulb-on-outline"
            size={20}
            color={theme === "light" ? "#EA580C" : "#F97316"}
          />
        </View>
      </View>
      <View className="my-5 gap-3 border-b border-slate-200 pb-5 dark:border-[#324166]">
        <Text className="text-sm font-nata-sans-bold tracking-[2px] text-slate-500 dark:text-slate-400">
          TECH STACK
        </Text>

        <View className="flex-row flex-wrap gap-2">
          {data.techStack.map((tech, index) => (
            <View
              key={index}
              className={`rounded-lg px-3 py-1.5 ${diffStyle.border} ${diffStyle.bg}`}
            >
              <Text
                className={`text-[11px] font-nata-sans-bold ${diffStyle.text}`}
              >
                {tech}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <View className="mb-6 gap-3">
        <Text className="text-sm font-nata-sans-bold tracking-[2px] text-slate-500 dark:text-slate-400">
          WHAT YOU&apos;LL LEARN
        </Text>

        {data.whatYouWillLearn.map((item, index) => (
          <View key={index} className="flex-row items-start gap-3">
            <View className="mt-0.5 h-6 w-6 items-center justify-center rounded-full bg-orange-100 dark:bg-amber-950">
              <Feather
                name="check"
                size={14}
                color={theme === "light" ? "#EA580C" : "#F97316"}
              />
            </View>

            <Text className="flex-1 text-[13px] font-nata-sans-medium leading-5 text-slate-700 dark:text-slate-300">
              {item}
            </Text>
          </View>
        ))}
      </View>
      <View className="flex-1 flex-row gap-3">
        <Pressable
          onPress={onSave}
          disabled={isButtonDisabled}
          className={`flex-1 flex-row items-center justify-center rounded-xl border py-3
    ${
      !isLatest
        ? "border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
        : saveStatus === "saved" || saveStatus === "updated" || isUptoDate
          ? "border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-500/20"
          : "border-orange-300 bg-orange-50 dark:border-orange-800 dark:bg-orange-700/20"
    }`}
        >
          {saveStatus === "saving" ? (
            <>
              <ActivityIndicator
                size="small"
                color={theme === "light" ? "#EA580C" : "#F97316"}
              />
              <Text className="ml-2 font-nata-sans-bold text-orange-600 dark:text-orange-400">
                {isProjectInVault ? "Updating..." : "Saving..."}
              </Text>
            </>
          ) : (
            <>
              <Feather
                name={
                  !isLatest
                    ? "lock"
                    : saveStatus === "saved" ||
                        saveStatus === "updated" ||
                        isUptoDate
                      ? "check-circle"
                      : isProjectInVault
                        ? "refresh-cw"
                        : "bookmark"
                }
                size={18}
                color={
                  !isLatest
                    ? theme === "light"
                      ? "#94A3B8"
                      : "#64748B"
                    : saveStatus === "saved" ||
                        saveStatus === "updated" ||
                        isUptoDate
                      ? theme === "light"
                        ? "#059669"
                        : "#34D399"
                      : theme === "light"
                        ? "#EA580C"
                        : "#F97316"
                }
              />
              <Text
                className={`ml-2 font-nata-sans-bold ${
                  !isLatest
                    ? "text-slate-400 dark:text-slate-500"
                    : saveStatus === "saved" ||
                        saveStatus === "updated" ||
                        isUptoDate
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-orange-600 dark:text-orange-400"
                }`}
              >
                {buttonText}
              </Text>
            </>
          )}
        </Pressable>
        {isLatest &&
          (saveStatus === "saved" ||
            saveStatus === "updated" ||
            (isProjectInVault && isUptoDate)) && (
            <Pressable
              className="p-3 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
              onPress={handleRouteToDetailedScreen}
            >
              <MaterialCommunityIcons
                name="arrow-top-right"
                size={24}
                color={theme === "light" ? "#EA580C" : "#FB923C"}
              />
            </Pressable>
          )}
      </View>
    </Animated.View>
  );
}
