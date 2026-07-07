import { ms, vs } from "@/src/constants/responsive";
import { LinearGradient } from "expo-linear-gradient";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import useThemeStore from "../store/useThemeStore";

type GradientButtonProps = {
  buttonText: string;
  loadingText?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  isDelete?: boolean;
  onSubmit: () => void;
};

export default function SubmitButton({
  buttonText,
  loadingText,
  isDisabled = false,
  isLoading = false,
  isDelete = false,
  onSubmit,
}: GradientButtonProps) {
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === "dark";

  const gradientColors: [string, string] = isDelete
    ? ["#ef4444", "#dc2626"]
    : ["#f97316", "#ea580c"];

  const activeColors: [string, string] =
    isDisabled && !isLoading
      ? isDark
        ? ["#334155", "#1e293b"]
        : ["#cbd5e1", "#94a3b8"]
      : gradientColors;

  return (
    <Pressable
      onPress={onSubmit}
      disabled={isDisabled || isLoading}
      style={({ pressed }) => [
        shapes.pressableContainer,
        { transform: [{ scale: pressed ? 0.97 : 1 }] },
        (isDisabled || isLoading) && shapes.disabledState,
      ]}
    >
      <LinearGradient
        colors={activeColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={shapes.button}
      >
        {isLoading ? (
          <View className="flex-row items-center gap-x-2">
            <ActivityIndicator size="small" color="#ffffff" />
            <Text
              style={shapes.buttonText}
              className="text-white font-nata-sans-bold tracking-wide"
            >
              {loadingText || "Processing..."}
            </Text>
          </View>
        ) : (
          <Text
            style={shapes.buttonText}
            className="text-white font-nata-sans-bold tracking-wide"
          >
            {buttonText}
          </Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const shapes = StyleSheet.create({
  pressableContainer: {
    width: "100%",

    shadowColor: "#ea580c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  button: {
    width: "100%",
    height: vs(52),
    borderRadius: ms(16),
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: ms(20),
  },
  disabledState: {
    opacity: 0.65,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontSize: ms(16),
  },
});
