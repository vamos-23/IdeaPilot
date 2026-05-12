import React from "react";
import { View, Text } from "react-native";
import { sc } from "../constants/responsive";
import { ProjectIdea } from "../constants/types";
import { AnimatedTabBar } from "../animations/components/ideaTabs/AnimatedTabBar";

type DashboardHeaderProps = {
  username: string | null | undefined;
  isDark: boolean;
  userId: string;
  isBookmarked: boolean;
  toggleBookmark: (item: ProjectIdea, userId: string) => void;
  loading: boolean;
};

const DashboardHeader = ({
  username,
  isDark,
  userId,
  toggleBookmark,
  loading,
}: DashboardHeaderProps) => {
  return (
    <View className="pt-12 mb-3 px-6">
      <View className="flex-row justify-between items-start mb-6">
        <View className="flex-1">
          <Text
            className="text-slate-900 dark:text-white font-nata-sans-bold tracking-tight"
            style={{
              fontSize: sc(26),
            }}
          >
            Hello, {username || "Builder"} 👋
          </Text>

          <Text
            className="text-slate-500 dark:text-slate-400 font-nata-sans-medium mt-2"
            style={{
              fontSize: sc(15),
            }}
          >
            Ready to work on your next project?
          </Text>
        </View>
      </View>

      {/* <View className="mb-5">
        <View className="flex-row items-center mb-5">
          <Text
            className="text-orange-600 dark:text-orange-500 font-nata-sans-bold uppercase tracking-[2px]"
            style={{
              fontSize: sc(11),
            }}
          >
            🔥 Project of the Week
          </Text>

          <View className="flex-1 ml-4 h-[1px] bg-orange-600/70 dark:bg-orange-500/70 rounded-full" />
        </View>

        {showSkeleton ? (
          <SkeletonProjectCard />
        ) : (
          <ProjectCard
            item={featuredProject}
            isDark={isDark}
            userId={userId}
            toggleBookmark={toggleBookmark}
          />
        )}
      </View> */}

      <View className="flex-row items-center h-[40px] mb-5">
        <Text
          className="text-orange-600 dark:text-orange-500 font-nata-sans-bold uppercase tracking-[2px]"
          style={{
            fontSize: sc(11),
          }}
        >
          💡 Your Projects
        </Text>

        <View className="flex-1 ml-4 h-[1px] bg-orange-600/70 dark:bg-orange-500/70 rounded-full" />
      </View>
      <AnimatedTabBar />
    </View>
  );
};

export default React.memo(DashboardHeader);
