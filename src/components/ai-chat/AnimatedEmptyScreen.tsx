import { Text, StyleSheet } from "react-native";
import {
  useKeyboardHandler,
  NativeEvent,
} from "react-native-keyboard-controller";
import Animated, {
  useSharedValue,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

type EmptyStateProps = {
  isFirstOpen: boolean;
  isVisible: boolean;
  username: string | null | undefined;
};

export default function AnimatedEmptyScreen({
  isFirstOpen,
  isVisible,
  username,
}: EmptyStateProps) {
  const keyboardHeight = useSharedValue(0);
  const val = isVisible ? 1 : 0;
  useKeyboardHandler(
    {
      onMove: (e: NativeEvent) => {
        "worklet";
        keyboardHeight.value = e.height;
      },
      onEnd: (e: NativeEvent) => {
        "worklet";
        keyboardHeight.value = e.height;
      },
    },
    [],
  );

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      keyboardHeight.value,
      [0, 300],
      [0, -80],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(
      keyboardHeight.value,
      [0, 300],
      [1, 0.87],
      Extrapolation.CLAMP,
    );
    const opacity = withTiming(val, { duration: 250 });
    return {
      opacity,
      transform: [{ translateY }, { scale }],
    };
  });

  const emptyStateText = isFirstOpen
    ? `Hey ${username}, what's on\nyour mind?`
    : `Ask away, ${username}!`;

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        styles.emptyContainer,
        animatedStyle,
      ]}
      pointerEvents={isVisible ? "auto" : "none"}
    >
      <Text className="font-nata-sans-bold text-2xl text-center text-textLight dark:text-white">
        {emptyStateText}
      </Text>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
});
