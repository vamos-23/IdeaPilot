import React, { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Compass, Sparkles, Bookmark } from "lucide-react-native";
import { useIdeas } from "@/src/store/useIdeas";
import useThemeStore from "@/src/store/useThemeStore";
import { sc } from "@/src/constants/responsive";
import { TabType } from "@/src/constants/types";

const TABS: { id: TabType; label: string; Icon: any }[] = [
  { id: "discover", label: "Discover", Icon: Compass },
  { id: "bookmarked", label: "Saved", Icon: Bookmark },
  { id: "ai", label: "AI Vault", Icon: Sparkles },
];

export const AnimatedTabBar = memo(function AnimatedTabBar() {
  const activeTab = useIdeas((state) => state.activeTab);
  const setActiveTab = useIdeas((state) => state.setActiveTab);

  const isDark = useThemeStore((state) => state.theme === "dark");

  return (
    <View className="flex-row mb-3 bg-blue-500/10 dark:bg-slate-800/60 p-2 rounded-2xl border border-blue-500/10 dark:border-white/5">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TabButton
            key={tab.id}
            tab={tab}
            isActive={isActive}
            onPress={() => setActiveTab(tab.id)}
            isDark={isDark}
          />
        );
      })}
    </View>
  );
});

const TabButton = ({
  tab,
  isActive,
  onPress,
  isDark,
}: {
  tab: (typeof TABS)[0];
  isActive: boolean;
  onPress: () => void;
  isDark: boolean;
}) => {
  const bgAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isActive ? 1 : 0, { duration: 200 }),
      transform: [
        {
          scale: withSpring(isActive ? 1 : 0.9, {
            damping: 15,
            stiffness: 150,
          }),
        },
      ],
    };
  });

  const activeColor = isDark ? "#ea580c" : "#ea580c";
  const inactiveColor = isDark ? "#94a3b8" : "#64748b";

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="flex-1 items-center py-3 justify-between rounded-xl"
    >
      <Animated.View
        style={[
          bgAnimatedStyle,
          { position: "absolute", top: 2, left: 0, right: 0, bottom: 2 },
        ]}
        className="bg-white dark:bg-slate-700 rounded-xl shadow-sm border border-slate-200/50 dark:border-slate-600/50"
      />

      <View className="flex-row items-center justify-center">
        <tab.Icon
          size={sc(16)}
          color={isActive ? activeColor : inactiveColor}
          strokeWidth={isActive ? 2.5 : 2}
        />
        <Text
          className={`font-nata-sans-bold ml-2 ${
            isActive
              ? "text-orange-600 dark:text-orange-500"
              : "text-slate-500 dark:text-slate-400"
          }`}
          style={{ fontSize: sc(11), letterSpacing: 0.5 }}
        >
          {tab.label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
