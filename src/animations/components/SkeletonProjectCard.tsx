import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
} from "react-native-reanimated";

import { useEffect } from "react";

export function SkeletonProjectCard() {
  const shimmer = useSharedValue<number>(-300);

  useEffect(() => {
    shimmer.value = withRepeat(withTiming(1000, { duration: 2500 }), -1);
  }, [shimmer]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmer.value }, { skewX: "-20deg" }],
  }));

  return (
    <View
      className="p-4 mb-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-slate-500 dark:bg-[#121720]"
      style={{ overflow: "hidden" }}
    >
      {/* TOP BADGES */}
      <View className="flex-row justify-between items-center pt-2">
        <View className="h-6 w-20 bg-gray-400 dark:bg-gray-700 rounded-full" />

        <View className="h-6 w-20 bg-gray-400 dark:bg-gray-700 rounded-full" />
      </View>

      {/* TITLE + DESCRIPTION */}
      <View className="mt-5 gap-y-2">
        <View className="h-5 w-3/4 bg-gray-400 dark:bg-gray-700 rounded-md" />

        <View className="h-4 w-full bg-gray-400 dark:bg-gray-700 rounded-md" />

        <View className="h-4 w-2/3 bg-gray-400 dark:bg-gray-700 rounded-md" />
      </View>

      {/* CATEGORY */}
      <View className="flex-row items-center mt-4">
        <View className="h-4 w-20 bg-gray-400 dark:bg-gray-700 rounded-md" />

        <View className="ml-3 h-6 w-24 bg-gray-400 dark:bg-gray-700 rounded-full" />
      </View>

      {/* SHIMMER OVERLAY */}
      <Animated.View
        style={[
          {
            position: "absolute",
            height: "100%",
            width: 120,
            backgroundColor: "#ffffff",
            opacity: 0.08,
          },
          shimmerStyle,
        ]}
      />
    </View>
  );
}
