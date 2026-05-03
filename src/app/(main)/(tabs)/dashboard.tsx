import { SkeletonProjectCard } from "@/src/animations/components/SkeletonProjectCard";
import { AnimatedProjectCard } from "@/src/animations/components/AnimatedProjectCard";
import { ProjectIdea, Stats } from "@/src/constants/types";
import useAuthStore from "@/src/store/useAuthStore";
import { useIdeas } from "@/src/store/useIdeas";
import useThemeStore from "@/src/store/useThemeStore";
import { FlashList } from "@shopify/flash-list";
import { Bookmark, CircleCheck, CirclePlay, Clock } from "lucide-react-native";
import { useCallback, useEffect, useMemo } from "react";
import { View } from "react-native";
import DashboardHeader from "@/src/components/DashboardHeader";
import { sc, vs } from "../../../constants/responsive";

export default function Dashboard() {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const { ideas, fetchInitialIdeas, loading } = useIdeas();
  const { user } = useAuthStore();
  const username = user?.userName;

  useEffect(() => {
    fetchInitialIdeas();
  }, []);

  const list: ProjectIdea[] = useMemo(() => {
    if (loading) {
      return Array.from(
        { length: 6 },
        (_, i) => ({ id: `skeleton-${i}` }) as ProjectIdea,
      );
    }
    return ideas || [];
  }, [loading, ideas]);

  const stats: Stats[] = useMemo(
    () => [
      {
        title: "Total Saved",
        value: 0,
        textColor: isDark ? "#94a3b8" : "#64748b",
        icon: (
          <Bookmark
            stroke={isDark ? "#94a3b8" : "#64748b"}
            size={sc(22)}
            strokeWidth={2.5}
          />
        ),
      },
      {
        title: "Building",
        value: 0,
        textColor: "#3b82f6",
        icon: <CirclePlay stroke="#3b82f6" size={sc(22)} strokeWidth={2.5} />,
      },
      {
        title: "Mastered",
        value: 0,
        textColor: "#10b981",
        icon: <CircleCheck stroke="#10b981" size={sc(22)} strokeWidth={2.5} />,
      },
      {
        title: "Next Up",
        value: 0,
        textColor: "#f59e0b",
        icon: <Clock stroke="#f59e0b" size={sc(22)} strokeWidth={2.5} />,
      },
    ],
    [isDark],
  );

  const renderIdeas = useCallback(
    ({ item, index }: { item: ProjectIdea; index: number }) => {
      if (loading || (item.id && item.id.startsWith("skeleton"))) {
        return <SkeletonProjectCard />;
      }
      return <AnimatedProjectCard item={item} index={index} />;
    },
    [loading],
  );

  return (
    <View className="bg-brandLight dark:bg-brandDark flex-1">
      <FlashList
        data={list}
        keyExtractor={(item, index) =>
          loading ? `skeleton-${index}` : item.id
        }
        renderItem={renderIdeas}
        ListHeaderComponent={
          <DashboardHeader username={username} statistics={stats} />
        }
        contentContainerStyle={{
          backgroundColor: "transparent",
          paddingHorizontal: sc(20),
          paddingBottom: vs(70),
          paddingTop: vs(10),
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
