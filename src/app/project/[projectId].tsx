import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  FileSearch,
  Clock,
  Layout,
  GraduationCap,
  ArrowLeft,
  Code2,
  Sparkles,
  CheckCircle2,
} from "lucide-react-native";
import { useIdeas } from "@/src/store/useIdeas";
import { vs, sc } from "../../constants/responsive";
import { DIFFICULTY_STYLES } from "../../constants/projectCardStyles/project-card-styles";
import useThemeStore from "@/src/store/useThemeStore";

export default function ProjectDetails() {
  const router = useRouter();
  const { theme: appTheme } = useThemeStore();
  const isDark = appTheme === "dark";
  const { projectId } = useLocalSearchParams();
  const { ideas } = useIdeas();

  const projectData = ideas.find((idea) => idea.id === projectId);
  const diffKey = projectData?.difficulty as keyof typeof DIFFICULTY_STYLES;
  const diffStyle =
    DIFFICULTY_STYLES[diffKey] || DIFFICULTY_STYLES.Intermediate;
  const iconColor = isDark
    ? diffKey === "Beginner"
      ? "#10b981"
      : diffKey === "Advanced"
        ? "#fb7185"
        : "#fbbf24"
    : diffKey === "Beginner"
      ? "#059669"
      : diffKey === "Advanced"
        ? "#e11d48"
        : "#d97706";

  if (!projectData) {
    return (
      <View className="flex-1 bg-brandLight dark:bg-brandDark justify-center items-center p-8">
        <View className="bg-orange-500/10 dark:bg-cardDark p-10 rounded-full mb-6">
          <FileSearch size={sc(80)} color="#ea580c" />
        </View>
        <Text className="text-2xl font-nata-sans-bold text-slate-900 dark:text-white">
          Project Not Found
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-8 bg-orange-600 px-10 py-4 rounded-2xl"
        >
          <Text className="text-white font-nata-sans-bold">Return Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-brandLight dark:bg-brandDark">
      <View className="flex-row items-center justify-between px-6 pt-12 pb-5 border-b border-slate-200 dark:border-white/5">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2.5 bg-white dark:bg-cardDark rounded-xl border border-slate-200 dark:border-white/10"
        >
          <ArrowLeft color={iconColor} size={24} />
        </TouchableOpacity>
        <Text className="text-lg font-nata-sans-bold text-slate-900 dark:text-white">
          Project Specs
        </Text>
        <View className="w-12" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: vs(40) }}
      >
        <View className="p-6">
          <View className="flex-row items-center gap-3 mb-6">
            <View
              className={`px-4 py-1.5 rounded-full border ${diffStyle.bg} ${diffStyle.border}`}
            >
              <Text
                className={`font-nata-sans-bold text-[10px] uppercase tracking-widest ${diffStyle.text}`}
              >
                {diffStyle.label}
              </Text>
            </View>
            <View className="px-4 py-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-cardDark">
              <Text className="text-slate-500 dark:text-slate-400 font-nata-sans-bold text-[10px] uppercase tracking-widest">
                {projectData.category}
              </Text>
            </View>
          </View>

          <Text className="text-[32px] font-nata-sans-bold text-slate-900 dark:text-white mb-2 leading-tight">
            {projectData.name}
          </Text>
          <Text className="text-slate-500 dark:text-slate-400 font-nata-sans-medium text-sm mb-8">
            Domain:{" "}
            <Text className="text-slate-500 dark:text-slate-400">
              {projectData.domain}
            </Text>
          </Text>

          <View className="flex-row gap-4 mb-10">
            {[
              {
                label: "Timeline",
                val: projectData.estimatedTime,
                icon: Clock,
              },
              {
                label: "Difficulty",
                val: projectData.difficulty,
                icon: Layout,
              },
            ].map((stat, i) => (
              <View
                key={i}
                className="flex-1 bg-white dark:bg-cardDark p-5 rounded-[24px] border border-slate-100 dark:border-white/5 items-center"
              >
                <View
                  style={{ backgroundColor: iconColor + "15" }}
                  className="p-3 rounded-2xl mb-3"
                >
                  <stat.icon size={20} color={iconColor} />
                </View>
                <Text className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-nata-sans-bold mb-1">
                  {stat.label}
                </Text>
                <Text className="text-slate-900 dark:text-white font-nata-sans-bold text-[13px]">
                  {stat.val}
                </Text>
              </View>
            ))}
          </View>

          {/* Concept Section */}
          <View className="mb-10">
            <View className="flex-row items-center mb-4">
              <Sparkles size={20} color={iconColor} />
              <Text className="text-xl font-nata-sans-bold text-slate-900 dark:text-white ml-3">
                The Concept
              </Text>
            </View>
            <Text className="text-slate-600 dark:text-slate-400 font-nata-sans-medium text-[16px] leading-7">
              {projectData.detailedDescription}
            </Text>
          </View>

          {/* Learning Path - Highlighted Card */}
          <View
            className={`mb-10 p-6 bg-white dark:bg-cardDark rounded-[32px] border border-slate-100 dark:border-white/10`}
          >
            <View className="flex-row items-center mb-6">
              <View
                style={{ backgroundColor: iconColor + "15" }}
                className="p-2.5 rounded-2xl"
              >
                <GraduationCap size={22} color={iconColor} />
              </View>
              <Text className="text-xl font-nata-sans-bold text-slate-900 dark:text-white ml-4">
                Learning Path
              </Text>
            </View>
            {projectData.whatYouWillLearn.map((item: string, index: number) => (
              <View key={index} className="flex-row items-start mb-5">
                <View className="mt-1 mr-4">
                  <CheckCircle2 size={18} color={iconColor} strokeWidth={2.5} />
                </View>
                <Text className="flex-1 text-slate-700 dark:text-slate-300 font-nata-sans-medium text-[15px] leading-6">
                  {item}
                </Text>
              </View>
            ))}
          </View>

          {/* Toolkit Section */}
          <View>
            <View className="flex-row items-center mb-5">
              <Code2 size={20} color={iconColor} />
              <Text className="text-xl font-nata-sans-bold text-slate-900 dark:text-white ml-3">
                Toolkit
              </Text>
            </View>
            <View className="flex-row flex-wrap gap-3">
              {projectData.techStack.map((tech: string, index: number) => (
                <View
                  key={index}
                  className="bg-white dark:bg-brandDark px-5 py-3 rounded-2xl border border-slate-100 dark:border-orange-500/10"
                >
                  <Text className="text-slate-700 dark:text-orange-400 font-nata-sans-bold text-[11px] uppercase tracking-wider">
                    {tech}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
