import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from "react-native";
import { sc, vs } from "../../../constants/responsive";
import { Search, X } from "lucide-react-native";
import { useCallback, useMemo, useState, startTransition } from "react";
import useThemeStore from "@/src/store/useThemeStore";
import useAuthStore from "@/src/store/useAuthStore";
import { useFocusEffect, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FlashList } from "@shopify/flash-list";
import useProjectStore from "@/src/store/useProjectStore";
import { FetchedProjects } from "@/src/constants/types";
import { SkeletonProjectCard } from "@/src/animations/components/project/SkeletonProjectCard";
import { CustomProjectCard } from "../custom-components/CustomProjectCard";
import SubmitButton from "../../SubmitButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SKELETON_DATA = Array.from(
  { length: 6 },
  (_, i) =>
    ({
      id: `skeleton-${i}`,
    }) as FetchedProjects,
);

const renderSeparator = () => <View className="h-4" />;

export default function ManualProjectsWorkspace() {
  const { top, bottom } = useSafeAreaInsets();
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.userId);
  const isDark = useThemeStore((s) => s.theme === "dark");
  const colorScheme = isDark ? "#94A3B8" : "#64748B";
  const [searchQuery, setSearchQuery] = useState<string>("");
  const projects = useProjectStore((s) => s.projects);
  const loading = useProjectStore((s) => s.loading);
  const fetchCustomProjects = useProjectStore((s) => s.fetchCustomProjects);

  useFocusEffect(
    useCallback(() => {
      if (!userId) return;
      let frameId: number;
      frameId = requestAnimationFrame(() => {
        startTransition(() => {
          fetchCustomProjects(userId);
        });
      });

      return () => {
        if (frameId) {
          cancelAnimationFrame(frameId);
        }
      };
    }, [userId, fetchCustomProjects]),
  );

  useFocusEffect(
    useCallback(() => {
      if (!userId) return;

      fetchCustomProjects(userId);
    }, [userId, fetchCustomProjects]),
  );

  const navigateToBasicDetailsScreen = () => {
    router.navigate("/(main)/manual-projects/create/basic");
  };

  const filteredList = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (loading) {
      return SKELETON_DATA;
    }

    if (!query) {
      return projects;
    }

    return projects.filter((project) => {
      return (
        project.projectName.toLowerCase().includes(query) ||
        project.category.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.detailedDescription.toLowerCase().includes(query) ||
        project.domain.toLowerCase().includes(query) ||
        project.difficulty.toLowerCase().includes(query) ||
        project.technologies.some((tech) => tech.toLowerCase().includes(query))
      );
    });
  }, [loading, projects, searchQuery]);

  const EmptyListState = useCallback(
    ({ searchQuery }: { searchQuery: string }) => (
      <View className="flex-1 mt-10">
        <View className="items-center gap-3">
          <Ionicons
            name={searchQuery ? "search-outline" : "folder-open"}
            size={90}
            color="#ea580c"
          />
          <Text className="font-nata-sans-bold text-textLight dark:text-white text-2xl text-center">
            {searchQuery
              ? "Try a different search term."
              : "Create your first custom project."}
          </Text>
        </View>
      </View>
    ),
    [],
  );

  const renderCustomProject = useCallback(
    ({ item }: { item: FetchedProjects }) => {
      if (item.id.startsWith("skeleton")) {
        return <SkeletonProjectCard />;
      }

      return (
        <CustomProjectCard
          item={item}
          isDark={isDark}
          userId={userId as string}
        />
      );
    },
    [isDark, userId],
  );

  const getItemType = useCallback((item: FetchedProjects) => {
    return item.id.startsWith("skeleton") ? "skeleton" : "card";
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View
        className="flex-1 bg-brandLight dark:bg-brandDark p-5"
        style={{ paddingTop: top + 20, paddingBottom: bottom }}
      >
        <View className="pb-5 gap-3 border-b border-[#ea580c] dark:border-[#f97316]">
          <Text
            className="text-textLight dark:text-white font-nata-sans-bold"
            style={{ fontSize: sc(23) }}
          >
            Project Workspace
          </Text>
          <Text className="text-slate-500 dark:text-slate-400 text-base font-nata-sans-medium">
            Create, organize and manage your own projects
          </Text>
          <View className="h-16">
            <View className="flex-1 flex-row items-center border border-[#CBD5E1]/40 dark:border-[#334155]/40 bg-white dark:bg-[#1E293B] rounded-full px-4 shadow-sm dark:shadow-none">
              <Search size={20} color={colorScheme} />
              <TextInput
                className="flex-1 ml-2 text-base font-nata-sans-bold text-[#1E293B] dark:text-[#F8FAFC]"
                placeholder="Search projects..."
                placeholderTextColor={colorScheme}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery("")} className="p-1">
                  <X size={18} color={colorScheme} />
                </Pressable>
              )}
            </View>
          </View>
        </View>

        <FlashList
          data={filteredList}
          keyExtractor={(item) => item.id}
          renderItem={renderCustomProject}
          getItemType={getItemType}
          //@ts-ignore
          estimatedItemSize={190}
          drawDistance={400}
          ListEmptyComponent={
            loading ? null : <EmptyListState searchQuery={searchQuery.trim()} />
          }
          ItemSeparatorComponent={renderSeparator}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingVertical: vs(10),
            flexGrow: 1,
          }}
        />
        <View className="pb-3 bg-brandLight dark:bg-brandDark">
          <SubmitButton
            buttonText="Create New Project"
            onSubmit={navigateToBasicDetailsScreen}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
