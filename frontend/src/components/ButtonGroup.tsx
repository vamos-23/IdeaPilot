import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { vs } from "../constants/responsive";
import useSkillStore from "../store/useSkillStore";
import SubmitButton from "./SubmitButton";
type RoutesType = {
  nextRoute:
    | "/(onboarding)/techstack"
    | "/(onboarding)/completionpage"
    | "/(auth)/signUp"
    | "/(onboarding)/welcome";
};

export default function ButtonGroup({ nextRoute }: RoutesType) {
  const router = useRouter();
  const { skills } = useSkillStore();

  const isButtonDisabled =
    nextRoute === "/(onboarding)/techstack" ? false : skills.length === 0;

  const handleNext = () => {
    if (nextRoute === "/(auth)/signUp") {
      router.replace(nextRoute);
    } else if (nextRoute !== "/(onboarding)/welcome") {
      router.push(nextRoute);
    }
  };

  return (
    <View style={shapes.buttonGroupView}>
      <SubmitButton
        buttonText="Previous  ◀"
        isDisabled={nextRoute === "/(onboarding)/techstack"}
        onSubmit={() => router.back()}
      />

      <SubmitButton
        buttonText={nextRoute === "/(auth)/signUp" ? "Sign Up 👉" : "Next  ▶"}
        isDisabled={isButtonDisabled}
        onSubmit={handleNext}
      />
    </View>
  );
}
const shapes = StyleSheet.create({
  buttonGroupView: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginTop: vs(25),
    marginBottom: vs(2),
  },
});
