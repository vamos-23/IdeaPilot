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
  isDisabled: boolean;
  onSubmit: () => void;
  isLoading?: boolean;
};

export default function SubmitButton({
  buttonText,
  loadingText,
  isDisabled,
  isLoading,
  onSubmit,
}: GradientButtonProps) {
  const { theme } = useThemeStore();
  return (
    <Pressable
      onPress={onSubmit}
      disabled={isDisabled || isLoading}
      style={({ pressed }) => [
        { opacity: pressed ? 0.7 : 1 },
        shapes.pressableContainer,
      ]}
    >
      <LinearGradient
        colors={["#3b82f6", "#9333ea"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        style={[
          shapes.button,
          (isDisabled || isLoading) && shapes.disabledButton,
        ]}
      >
        {isLoading ? (
          <View className="flex-row gap-2">
            <ActivityIndicator
              size="small"
              color={theme === "light" ? "#ffffff" : "#040607"}
            />
            <Text
              style={shapes.buttonText}
              className="text-white dark:text-[#040607]"
            >
              {loadingText}
            </Text>
          </View>
        ) : (
          <Text
            style={shapes.buttonText}
            className="text-white dark:text-[#040607]"
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
  },
  button: {
    width: "100%",
    height: vs(44),
    borderRadius: ms(10),
    padding: ms(10),
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.55,
  },
  buttonText: {
    fontSize: ms(18),
    fontWeight: "500",
    justifyContent: "center",
  },
});
