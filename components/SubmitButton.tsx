import { Text, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { vs, ms } from "@/constants/responsive";
type GradientButtonProps = {
  buttonText: string;
  onSubmit: () => void;
};
export default function SubmitButton({
  onSubmit,
  buttonText,
}: GradientButtonProps) {
  return (
    <Pressable onPress={onSubmit}>
      <LinearGradient
        colors={["#3b82f6", "#9333ea"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={shapes.button}
        className="bg-white elevation-lg dark:elevation:none"
      >
        <Text style={shapes.buttonText} className="text-white dark:text-[#0D0707]">
          {buttonText}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}
const shapes = StyleSheet.create({
  button: {
    width: "100%",
    height: vs(44),
    borderRadius: ms(8),
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: ms(18),
    fontWeight: "500",
    justifyContent: "center",
  },
});
