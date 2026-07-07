import React from "react";
import { View, Text } from "react-native";
import { sc } from "../constants/responsive";
import { AnimatedTabBar } from "../animations/components/ideaTabs/AnimatedTabBar";
import ProjectCreator from "./manual-projects/ProjectWorkspaceViewer";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type DashboardHeaderProps = {
  username: string | null | undefined;
};

const DashboardHeader = ({ username }: DashboardHeaderProps) => {
  const { top } = useSafeAreaInsets();
  return (
    <View className="mb-3 px-6" style={{ paddingTop: top + 20 }}>
      <View className="flex-wrap justify-between items-start mb-3">
        <Text
          className="text-slate-900 dark:text-white font-nata-sans-bold tracking-wider"
          style={{
            fontSize: sc(25),
          }}
        >
          Hello, {username || "Builder"} 👋
        </Text>

        <Text className="text-slate-500 dark:text-slate-400 text-base font-nata-sans-medium mt-2">
          Ready to work on your next project?
        </Text>
      </View>

      <View className="flex-row justify-between items-center h-[40px] mb-5">
        <Text
          className="text-orange-600 dark:text-orange-500 font-nata-sans-bold uppercase tracking-[2px]"
          style={{
            fontSize: sc(11),
          }}
        >
          💡 Your Projects
        </Text>

        <View className="flex-1 ml-2 mr-2 h-[1px] bg-orange-600/70 dark:bg-orange-500/70 rounded-full" />

        <ProjectCreator />
      </View>
      <AnimatedTabBar />
    </View>
  );
};

export default React.memo(DashboardHeader);
