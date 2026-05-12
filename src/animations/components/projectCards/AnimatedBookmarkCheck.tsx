import { memo } from "react";

import { TouchableOpacity } from "react-native";

import { Bookmark, BookmarkCheck } from "lucide-react-native";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from "react-native-reanimated";

type AnimatedBookmarkCheckProps = {
  isBookmarked: boolean;
  onPress: () => void;
  isDark: boolean;
};

export const AnimatedBookmarkCheck = memo(function AnimatedBookmarkCheck({
  isBookmarked,
  onPress,
  isDark,
}: AnimatedBookmarkCheckProps) {
  const scale = useSharedValue(1);

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(1.18, {
        damping: 12,
        stiffness: 200,
      }),
      withSpring(1, {
        damping: 12,
        stiffness: 200,
      }),
    );
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const activeColor = isDark ? "#fb923c" : "#3b82f6";
  const inactiveColor = isDark ? "#94a3b8" : "#1E3A8A";

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7} hitSlop={20}>
      <Animated.View style={[animatedStyle, { padding: 4 }]}>
        {isBookmarked ? (
          <BookmarkCheck size={20} color={activeColor} strokeWidth={2.5} />
        ) : (
          <Bookmark size={20} color={inactiveColor} strokeWidth={2} />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
});
