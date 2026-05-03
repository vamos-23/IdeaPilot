import { TouchableOpacity } from "react-native";
import { sc } from "../constants/responsive";
import { useIdeas } from "../store/useIdeas";
import Animated, {
  withTiming,
  useAnimatedStyle,
  useSharedValue,
  cancelAnimation,
  withRepeat,
  Easing,
} from "react-native-reanimated";
import { RefreshCw } from "lucide-react-native";
import { useEffect } from "react";

const AnimatedRefreshIcon = Animated.createAnimatedComponent(RefreshCw);

export default function RefreshButton() {
  const { refreshIdeas, refreshing } = useIdeas();
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (refreshing) {
      rotation.value = withRepeat(
        withTiming(360, {
          duration: 1000,
          easing: Easing.linear,
        }),
        -1,
      );
    } else {
      cancelAnimation(rotation);
      rotation.value = withTiming(0);
    }
  }, [refreshing]);

  const animatedRefreshIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });
  return (
    <TouchableOpacity
      className="rounded-full items-center p-3 bg-blue-500"
      onPress={refreshIdeas}
      disabled={refreshing}
    >
      <AnimatedRefreshIcon
        style={animatedRefreshIconStyle}
        color="#ffffff"
        size={sc(20)}
        strokeWidth={sc(2.5)}
      />
    </TouchableOpacity>
  );
}
