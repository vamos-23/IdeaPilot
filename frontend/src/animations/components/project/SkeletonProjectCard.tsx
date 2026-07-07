import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";
import useThemeStore from "../../../store/useThemeStore";

export function SkeletonProjectCard() {
  const isDark = useThemeStore((state) => state.theme === "dark");
  const shimmer = useSharedValue(-1);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, {
        duration: 1100,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, [shimmer]);

  const shimmerStyle = useAnimatedStyle(() => ({
    left: `${shimmer.value * 150}%`,
    transform: [{ skewX: "-30deg" }],
  }));

  return (
    <View className="p-5 rounded-[32px] border border-gray-200 dark:border-gray-800 bg-cardLight dark:bg-cardDark relative overflow-hidden">
      <View className="flex-row justify-between items-center mb-2">
        <View className="h-6 w-20 bg-gray-300/60 dark:bg-gray-700/60 rounded-full" />
        <View className="h-7 w-7 bg-gray-300/60 dark:bg-gray-700/60 rounded-full" />
      </View>

      <View className="gap-y-2">
        <View className="h-6 w-2/3 bg-gray-300/60 dark:bg-gray-700/60 rounded-xl" />
      </View>

      <View className="flex-row gap-2 mt-3">
        <View className="h-7 w-16 bg-gray-300/60 dark:bg-gray-700/60 rounded-xl" />
        <View className="h-7 w-16 bg-gray-300/60 dark:bg-gray-700/60 rounded-xl" />
        <View className="h-7 w-16 bg-gray-300/60 dark:bg-gray-700/60 rounded-xl" />
      </View>

      <View className="flex-row items-center justify-between mt-3 pt-4 border-t border-gray-200/40 dark:border-white/5">
        <View className="h-4 w-24 bg-gray-300/60 dark:bg-gray-700/60 rounded-md" />
        <View className="h-8 w-8 bg-gray-300/60 dark:bg-gray-700/60 rounded-full" />
      </View>

      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            bottom: 0,
            width: "30%",
            backgroundColor: isDark ? "#ffffff" : "#000000",
            opacity: isDark ? 0.06 : 0.04,
          },
          shimmerStyle,
        ]}
      />
    </View>
  );
}
