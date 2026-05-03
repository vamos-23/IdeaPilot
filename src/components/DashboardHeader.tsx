import { View, Text } from "react-native";
import { ProjectInfo } from "./ProjectInfo";
import { Stats } from "../constants/types";
import RefreshButton from "./RefreshButton";
import { sc } from "../constants/responsive";
import React from "react";
import useThemeStore from "../store/useThemeStore";

type DashboardHeaderProps = {
  username: string | null | undefined;
  statistics: Stats[];
};

const DashboardHeader = ({ username, statistics }: DashboardHeaderProps) => {
  const { theme } = useThemeStore();
  return (
    <View className="pt-8 mb-6">
      <View className="flex-row justify-between items-start mb-10">
        <View className="flex-1">
          <Text
            className="text-slate-900 dark:text-white font-nata-sans-bold tracking-tight"
            style={{ fontSize: sc(28) }}
          >
            Hello, {username || "Guest"} 👋
          </Text>
          <Text
            className="text-slate-500 dark:text-slate-400 font-nata-sans-medium mt-1.5"
            style={{ fontSize: sc(15) }}
          >
            Ready to work on your next project?
          </Text>
        </View>
      </View>
      <View>
        <View className="flex-row items-center mb-5">
          <Text
            className="text-orange-600 dark:text-orange-500 font-nata-sans-bold uppercase tracking-[2px]"
            style={{ fontSize: sc(11) }}
          >
            Your Progress
          </Text>
          <View
            className="flex-1 ml-4"
            style={{
              height: 2,
              backgroundColor: theme === "light" ? "#ea580c" : "#f97316",
              opacity: 0.7,
              borderRadius: 1,
            }}
          />
        </View>

        <View className="gap-y-4">
          {statistics.map((stat, index) => (
            <ProjectInfo key={index} {...stat} />
          ))}
        </View>
      </View>
      <View className="flex-row justify-between items-center pt-6">
        <View className="flex-1">
          <Text
            className="text-slate-900 dark:text-white font-nata-sans-bold"
            style={{ fontSize: sc(20) }}
          >
            Recommended Projects
          </Text>
          <View className="h-[1px] w-[280px] bg-orange-600 dark:bg-orange-500/50 rounded-full mt-2" />
        </View>
        <RefreshButton />
      </View>
    </View>
  );
};

export default React.memo(DashboardHeader);
