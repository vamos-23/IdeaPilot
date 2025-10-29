import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { vs } from "../constants/responsive";
import SubmitButton from "./SubmitButton";
import useSkillStore from "../store/useSkillStore";
import useAuthStore from "../store/useAuthStore";
import { useState } from "react";
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
  const { completeOnboarding } = useAuthStore();
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  //Wait for async operation before navigating ahead
  const handleNext = async () => {
    if (nextRoute === "/(auth)/signUp") {
      try {
        setButtonLoading(true);
        await completeOnboarding();
        const status = useAuthStore.getState().hasCompletedOnboarding;
        console.log("Onboarding status:", status);
        //** NEED TO UPDATE WITH router.replace() later!!!
        await new Promise((resolve) => setTimeout(resolve, 3000));
        router.push(nextRoute);
      } catch (e) {
        console.error("Onboarding error!", e);
      } finally {
        setButtonLoading(false);
      }
    } else {
      router.push(nextRoute);
    }
  };
  return (
    <View style={shapes.buttonGroupView}>
      <View>
        <SubmitButton
          buttonText="Previous  ◀"
          isDisabled={nextRoute === "/(onboarding)/techstack"}
          onSubmit={() => router.back()}
        />
      </View>
      <View>
        <SubmitButton
          buttonText={
            nextRoute === "/(auth)/signUp" ? "Sign Up 👉" : "Next  ▶"
          }
          loadingText="Analyzing stack..."
          isLoading={buttonLoading}
          isDisabled={isButtonDisabled}
          onSubmit={handleNext}
        />
      </View>
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
