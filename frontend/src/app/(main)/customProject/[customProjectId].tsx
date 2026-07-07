import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import {
  FileSearch,
  ArrowLeft,
  Code2,
  Sparkles,
  Workflow,
} from "lucide-react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { vs, sc } from "../../../constants/responsive";
import { DIFFICULTY_STYLES } from "../../../constants/projectCardStyles/project-card-styles";
import useThemeStore from "@/src/store/useThemeStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { updateProject as updateProjectService } from "@/src/services/ideas/projects.service";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { InformationCard } from "@/src/components/InformationCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useProjectStore from "@/src/store/useProjectStore";
import ResourceSection from "@/src/animations/components/project/ResourceSection";
import { presentBottomSheetModal } from "@/src/components/manual-projects/utils/presentBottomSheetModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import TechStackBottomSheet from "@/src/components/manual-projects/bottom-sheet-elements/TechStackBottomSheet";
import useAuthStore from "@/src/store/useAuthStore";
import { TECHNOLOGIES } from "@/src/constants/projectFormData";
import Toast from "react-native-toast-message";

export default function ProjectDetails() {
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const { theme: appTheme } = useThemeStore();
  const isDark = appTheme === "dark";
  const { customProjectId } = useLocalSearchParams();

  const [isLoading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isReady, setReady] = useState<boolean>(false);

  const userId = useAuthStore((s) => s.user?.userId);

  const techStackRef = useRef<BottomSheetModal | null>(null);
  const updateLocalProject = useProjectStore((s) => s.updateProjectsOnEdit);

  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(() => {
        setReady(true);
      });
    }, 350);

    return () => clearTimeout(timer);
  }, []);

  const projectData = useProjectStore(
    useCallback(
      (state) => {
        return state.projects.find((project) => project.id === customProjectId);
      },
      [customProjectId],
    ),
  );

  const [techStack, setTechStack] = useState(projectData?.technologies ?? []);

  const openEditScreen = () => {
    if (!projectData?.id) return;
    router.push({
      pathname: "/editProject/[editId]",
      params: { editId: projectData.id },
    });
  };

  const handleUpdateTechStack = async () => {
    if (!userId || !projectData) return;
    setLoading(true);
    try {
      const updates = {
        technologies: techStack,
      };

      await updateProjectService(userId, projectData.id, updates);

      updateLocalProject(projectData.id, updates);

      Toast.show({
        type: "success",
        text1: "Project updated 🎉",
        text2: "Your changes have been saved.",
        topOffset: vs(35),
      });

      techStackRef.current?.dismiss();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Please try again.";
      Toast.show({
        type: "error",
        text1: "Update failed!",
        text2: errorMessage,
        topOffset: vs(35),
      });
    } finally {
      setLoading(false);
    }
  };
  const { diffStyle, iconColor } = useMemo(() => {
    const diffKey =
      (projectData?.difficulty as keyof typeof DIFFICULTY_STYLES) || "Beginner";
    const style = DIFFICULTY_STYLES[diffKey] || DIFFICULTY_STYLES["Beginner"];
    const color = isDark ? style.iconDark : style.iconLight;
    return { diffStyle: style, iconColor: color };
  }, [projectData, isDark]);

  if (isPending || !isReady) {
    return <View className="flex-1 bg-brandLight dark:bg-brandDark" />;
  }

  if (!projectData) {
    return (
      <View className="flex-1 bg-brandLight dark:bg-brandDark items-center justify-center">
        <Animated.View
          className="justify-center items-center"
          entering={FadeInDown.duration(400).springify()}
          exiting={FadeIn.duration(400).springify()}
        >
          <View className="bg-orange-500/10 dark:bg-cardDark p-10 rounded-full mb-3">
            <FileSearch size={sc(80)} color="#ea580c" />
          </View>
          <Text className="text-2xl font-nata-sans-bold text-slate-900 dark:text-white">
            Project not found!
          </Text>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.back()}
            className="mt-8 bg-orange-600 px-10 py-4 rounded-2xl"
          >
            <Text className="text-white font-nata-sans-bold">
              Return to Workspace
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  return (
    <View
      className="flex-1 bg-brandLight dark:bg-brandDark"
      style={{ paddingTop: top + 20 }}
    >
      <View className="flex-row items-center justify-between px-5 pb-5 border-b border-slate-200 dark:border-white/5">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2.5 bg-white dark:bg-cardDark rounded-xl border border-slate-300 dark:border-white/10"
        >
          <ArrowLeft color={iconColor} size={24} />
        </TouchableOpacity>
        <Text className="text-xl font-nata-sans-bold text-slate-900 dark:text-white">
          Project Specs
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={openEditScreen}
          hitSlop={20}
        >
          <Entypo
            name="dots-three-vertical"
            size={20}
            color={appTheme === "dark" ? "#ffffff" : "#000000"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: vs(10) }}
      >
        <Animated.View
          className="p-6"
          entering={FadeInDown.duration(400).springify()}
          exiting={FadeIn.duration(400).springify()}
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
          </View>

          <Text className="text-[28px] font-nata-sans-bold text-slate-900 dark:text-white mb-4 leading-tight">
            {projectData.projectName}
          </Text>
          <Text className="text-slate-500 dark:text-slate-300 font-nata-sans-medium text-md mb-8 leading-5">
            {projectData.description}
          </Text>

          <InformationCard
            timelineValue={projectData.estimatedTime}
            categoryValue={projectData.category}
            iconColor={iconColor}
          />

          <View className="mb-4">
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

          <View className="mb-10">
            <View className="flex-row justify-between items-center mb-5">
              <View className="flex-row items-center">
                <Code2 size={20} color={iconColor} className="mt-2" />
                <Text className="text-xl font-nata-sans-bold text-slate-900 dark:text-white ml-3">
                  Technologies
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => presentBottomSheetModal(techStackRef)}
                hitSlop={20}
                className="mt-1"
              >
                <Entypo
                  name="dots-three-vertical"
                  size={14}
                  color={appTheme === "dark" ? "#ffffff" : "#000000"}
                />
              </TouchableOpacity>
            </View>
            <View className="flex-row flex-wrap gap-3">
              {projectData.technologies.map((tech, index) => (
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

          <View className="gap-3">
            <View className="flex-row items-center mb-4">
              <Workflow size={20} color={iconColor} />
              <Text className="text-xl font-nata-sans-bold text-slate-900 dark:text-white ml-3">
                Resources to explore
              </Text>
            </View>
            <View className="gap-4">
              <ResourceSection
                title="Video Tutorials"
                type="youtube"
                techStack={projectData.technologies}
                domain={projectData.domain}
                category={projectData.category}
              />
              <ResourceSection
                title="Github Repositories"
                type="github"
                techStack={projectData.technologies}
                domain={projectData.domain}
                category={projectData.category}
              />
            </View>
          </View>
        </Animated.View>
      </ScrollView>
      <TechStackBottomSheet
        ref={techStackRef}
        data={TECHNOLOGIES}
        technologies={techStack}
        onTechnologiesChange={(technologies) => setTechStack(technologies)}
        saveButton
        isLoading={isLoading}
        onSubmit={handleUpdateTechStack}
      />
    </View>
  );
}
