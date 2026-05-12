import { SkeletonProjectCard } from "@/src/animations/components/projectCards/SkeletonProjectCard";
import { ProjectCard } from "@/src/components/ProjectCard";
import DashboardHeader from "@/src/components/DashboardHeader";
import { ProjectIdea } from "@/src/constants/types";
import { sc, vs } from "@/src/constants/responsive";
import { useIdeas } from "@/src/store/useIdeas";
import useThemeStore from "@/src/store/useThemeStore";
import useAuthStore from "@/src/store/useAuthStore";
import { FlashList, type FlashListRef } from "@shopify/flash-list";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Toast from "react-native-toast-message";

const SKELETON_DATA = Array.from(
  { length: 6 },
  (_, i) =>
    ({
      id: `skeleton-${i}`,
    }) as ProjectIdea,
);

const EmptyListState = () => (
  <View
    className="flex-1 justify-center items-center"
    style={{ minHeight: vs(300) }}
  >
    <View className="items-center gap-3">
      <Ionicons name="server-outline" size={90} color="#ea580c" />

      <Text className="font-nata-sans-bold text-textLight dark:text-white text-2xl">
        No items found!
      </Text>
    </View>
  </View>
);

const renderSeparator = () => <View className="h-4" />;

export default function Dashboard() {
  const userId = useAuthStore((state) => state.user?.userId || "");
  const username = useAuthStore((state) => state.user?.userName || "Builder");
  const appTheme = useThemeStore((state) => state.theme);
  const isDark = appTheme === "dark";
  const flashListRef = useRef<FlashListRef<ProjectIdea>>(null);
  const fetchInitialIdeas = useIdeas((state) => state.fetchInitialIdeas);
  const refreshFeedRateLimiter = useIdeas(
    (state) => state.refreshFeedRateLimiter,
  );
  const refreshing = useIdeas((state) => state.refreshing);
  const bookmarkedIdeas = useIdeas((state) => state.bookmarkedIdeas);
  const aiIdeas = useIdeas((state) => state.aiIdeas);
  const activeTab = useIdeas((state) => state.activeTab);
  const loading = useIdeas((state) => state.loading);
  const recommendedIdeas = useIdeas((state) => state.recommendedIdeas);
  const toggleBookmark = useIdeas((state) => state.toggleBookmarkIdea);

  const isDiscover = activeTab === "discover";

  const handleRefresh = async () => {
    const response = await refreshFeedRateLimiter();
    if (response.allowed) {
      Toast.show({
        type: "success",
        text1: "Feed Updated 🎉",
        text2: `Refreshed Discover Feed successfull!!`,
        topOffset: vs(33),
      });
    }
    if (!response.allowed && response.reason === "cooldown") {
      Toast.show({
        type: "warning",
        text1: "WHOA! Take a breather! 🥵",
        text2: "You have reached refresh limit. Please wait for 2 minutes.",
        topOffset: vs(35),
      });
    }
    return;
  };
  useEffect(() => {
    if (!flashListRef.current) return;
    flashListRef.current.scrollToTop({
      animated: true,
    });
  }, [activeTab]);

  useEffect(() => {
    if (userId) {
      fetchInitialIdeas(userId);
    }
  }, [fetchInitialIdeas, userId]);

  const list = useMemo(() => {
    if (loading) {
      return SKELETON_DATA;
    }

    switch (activeTab) {
      case "discover":
        return recommendedIdeas;

      case "bookmarked":
        return bookmarkedIdeas;

      case "ai":
        return aiIdeas;

      default:
        return recommendedIdeas;
    }
  }, [loading, activeTab, recommendedIdeas, bookmarkedIdeas, aiIdeas]);

  const renderIdeas = useCallback(
    ({ item }: { item: ProjectIdea }) => {
      if (item.id.startsWith("skeleton")) {
        return <SkeletonProjectCard />;
      }

      return (
        <ProjectCard
          item={item}
          isDark={isDark}
          userId={userId}
          toggleBookmark={toggleBookmark}
        />
      );
    },
    [isDark, userId, toggleBookmark],
  );

  const getItemType = useCallback((item: ProjectIdea) => {
    return item.id.startsWith("skeleton") ? "skeleton" : "card";
  }, []);

  return (
    <View className="bg-brandLight dark:bg-brandDark flex-1">
      <DashboardHeader
        username={username}
        isDark={isDark}
        userId={userId}
        isBookmarked
        toggleBookmark={toggleBookmark}
        loading={loading}
      />

      <FlashList
        ref={flashListRef}
        data={list}
        keyExtractor={(item) => item.id}
        renderItem={renderIdeas}
        getItemType={getItemType}
        //@ts-ignore
        estimatedItemSize={190}
        drawDistance={400}
        estimatedFirstItemOffset={0}
        ListEmptyComponent={loading ? null : EmptyListState}
        onRefresh={handleRefresh}
        refreshing={isDiscover && refreshing}
        ItemSeparatorComponent={renderSeparator}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: sc(20),
          paddingBottom: vs(80),
          flexGrow: 1,
        }}
      />
    </View>
  );
}
