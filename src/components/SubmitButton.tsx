import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ms, vs } from "@/src/constants/responsive";
type GradientButtonProps = {
  buttonText: string;
  isDisabled: boolean;
  onSubmit: () => void;
};
export default function SubmitButton({
  buttonText,
  isDisabled,
  onSubmit
}: GradientButtonProps) {
  return (
    <TouchableOpacity onPress={onSubmit} disabled={isDisabled}>
      <LinearGradient
        colors={["#3b82f6", "#9333ea"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        style={[shapes.button, isDisabled && shapes.disabledButton]}
        className="elevation-lg dark:elevation-md"
      >
        <Text
          style={shapes.buttonText}
          className="text-white dark:text-[#040607]"
        >
          {buttonText}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}
const shapes = StyleSheet.create({
  button: {
    width: "100%",
    height: vs(44),
    borderRadius: ms(10),
    padding: ms(10),
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.55
  },
  buttonText: {
    fontSize: ms(18),
    fontWeight: "500",
    justifyContent: "center",
  },
});
