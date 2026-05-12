import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import {
  FileSearch,
  GraduationCap,
  ArrowLeft,
  Code2,
  Sparkles,
  CheckCircle2,
  Workflow,
} from "lucide-react-native";
import { useIdeas } from "@/src/store/useIdeas";
import { vs, sc } from "../../constants/responsive";
import { DIFFICULTY_STYLES } from "../../constants/projectCardStyles/project-card-styles";
import useThemeStore from "@/src/store/useThemeStore";
import SubmitButton from "@/src/components/SubmitButton";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import { InformationCard } from "@/src/components/InformationCard";

export default function ProjectDetails() {
  const router = useRouter();
  const { theme: appTheme } = useThemeStore();
  const isDark = appTheme === "dark";
  const { projectId } = useLocalSearchParams();

  const [isPending, startTransition] = useTransition();
  const [isReady, setReady] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(() => {
        setReady(true);
      });
    }, 350);

    return () => clearTimeout(timer);
  }, []);

  const projectData = useIdeas(
    useCallback(
      (state) => {
        return (
          state.recommendedIdeas.find((idea) => idea.id === projectId) ||
          state.bookmarkedIdeas.find((idea) => idea.id === projectId) ||
          state.aiIdeas.find((idea) => idea.id === projectId)
        );
      },
      [projectId],
    ),
  );

  const { diffStyle, trendingStyle, iconColor } = useMemo(() => {
    const diffKey =
      (projectData?.difficulty as keyof typeof DIFFICULTY_STYLES) || "Beginner";
    const style = DIFFICULTY_STYLES[diffKey] || DIFFICULTY_STYLES["Beginner"];
    const color = isDark ? style.iconDark : style.iconLight;
    const trendingStyle = DIFFICULTY_STYLES["Beginner"];
    return { diffStyle: style, trendingStyle: trendingStyle, iconColor: color };
  }, [projectData, isDark]);

  const isTrending = projectData?.isTrending;
  const handleGenerateRoadmap = () => {
    console.log("Generating roadmap for:", projectData?.name);
  };

  if (isPending || !isReady) {
    return <View className="flex-1 bg-brandLight dark:bg-brandDark" />;
  }

  if (!projectData) {
    return (
      <View className="flex-1 bg-brandLight dark:bg-brandDark items-center justify-center">
        <Animated.View
          className="justify-center items-center"
          entering={FadeInDown.duration(400).springify()}
        >
          <View className="bg-orange-500/10 dark:bg-cardDark p-10 rounded-full mb-3">
            <FileSearch size={sc(80)} color="#ea580c" />
          </View>
          <Text className="text-2xl font-nata-sans-bold text-slate-900 dark:text-white">
            Project not found!
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-8 bg-orange-600 px-10 py-4 rounded-2xl"
          >
            <Text className="text-white font-nata-sans-bold">
              Return to Dashboard
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-brandLight dark:bg-brandDark">
      <View className="flex-row items-center justify-between px-6 pt-12 pb-5 border-b border-slate-200 dark:border-white/5">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2.5 bg-white dark:bg-cardDark rounded-xl border border-slate-300 dark:border-white/10"
        >
          <ArrowLeft color={iconColor} size={24} />
        </TouchableOpacity>
        <Text className="text-xl font-nata-sans-bold text-slate-900 dark:text-white">
          Project Specs
        </Text>
        <View className="w-12" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: vs(40) }}
      >
        <Animated.View
          className="p-6"
          entering={FadeInDown.duration(400).springify()}
        >
          <View className="flex-row flex-wrap items-center gap-2 mb-6">
            <View
              className={`px-4 py-1.5 rounded-full border ${diffStyle.bg} ${diffStyle.border}`}
            >
              <Text
                className={`font-nata-sans-bold text-[10px] uppercase tracking-widest ${diffStyle.text}`}
              >
                {diffStyle.label}
              </Text>
            </View>
            <View className="px-4 py-1.5 rounded-full border border-cyan-500/65 dark:border-cyan-400/75 bg-cyan-500/10">
              <Text className="text-cyan-500/70 dark:text-cyan-400/100 font-nata-sans-bold text-[10px] uppercase tracking-widest">
                {projectData.domain}
              </Text>
            </View>
            {isTrending && (
              <View
                className={`px-4 py-1.5 rounded-full border ${trendingStyle.bg} ${trendingStyle.border} `}
              >
                <Text
                  className={`font-nata-sans-bold text-[10px] uppercase tracking-widest ${trendingStyle.text}`}
                >
                  Trending
                </Text>
              </View>
            )}
          </View>

          <Text className="text-[32px] font-nata-sans-bold text-slate-900 dark:text-white mb-4 leading-tight">
            {projectData.name}
          </Text>
          <Text className="text-slate-500 dark:text-slate-300 font-nata-sans-medium text-md mb-8 leading-5">
            {projectData.description}
          </Text>

          <InformationCard timelineValue={projectData.estimatedTime}  categoryValue={projectData.category} iconColor={iconColor} />

          <View className="mb-10">
            <View className="flex-row items-center mb-4">
              <Sparkles size={20} color={iconColor} />
              <Text className="text-xl font-nata-sans-bold text-slate-900 dark:text-white ml-3">
                The Concept
              </Text>
            </View>
            <Text className="text-slate-600 dark:text-slate-300 font-nata-sans-medium text-[16px] leading-7">
              {projectData.detailedDescription}
            </Text>
          </View>

          <View className="mb-10 p-6 bg-cardLight dark:bg-cardDark rounded-[32px] border border-slate-300 dark:border-white/10">
            <View className="flex-row items-center mb-6">
              <View
                style={{ backgroundColor: iconColor + "15" }}
                className="p-2.5 rounded-2xl"
              >
                <GraduationCap size={22} color={iconColor} />
              </View>
              <Text className="text-xl font-nata-sans-bold text-slate-900 dark:text-white ml-4">
                Learning Outcomes
              </Text>
            </View>
            {projectData.whatYouWillLearn.map((item, index) => (
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

          <View className="mb-10">
            <View className="flex-row items-center mb-5">
              <Code2 size={20} color={iconColor} />
              <Text className="text-xl font-nata-sans-bold text-slate-900 dark:text-white ml-3">
                Technologies
              </Text>
            </View>
            <View className="flex-row flex-wrap gap-3">
              {projectData.techStack.map((tech, index) => (
                <View
                  key={index}
                  className={`${diffStyle.bg} ${diffStyle.border} px-5 py-3 rounded-2xl`}
                >
                  <Text
                    className={`${diffStyle.text} font-nata-sans-bold text-[11px] uppercase tracking-wider`}
                  >
                    {tech}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View className="mb-5">
            <View className="flex-row items-center mb-5">
              <Workflow size={20} color={iconColor} />
              <Text className="text-xl font-nata-sans-bold text-slate-900 dark:text-white ml-3">
                Roadmap
              </Text>
            </View>
            <View className="p-6 bg-cardLight dark:bg-cardDark rounded-[32px] border border-slate-300 dark:border-white/10">
              <SubmitButton
                onSubmit={handleGenerateRoadmap}
                buttonText="Generate Roadmap"
                isDisabled={false}
                loadingText="Generating..."
              />
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
