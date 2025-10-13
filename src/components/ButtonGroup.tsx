import { View } from "react-native";
import { useRouter } from "expo-router";
import { sc, vs } from "../constants/responsive";
import SubmitButton from "./SubmitButton";
type RoutesType = {
  nextRoute:
    | "/(onboarding)/techstack"
    | "/(onboarding)/completionpage"
    | "/(main)/(tabs)/dashboard";
};
export default function ButtonGroup({ nextRoute }: RoutesType) {
  const router = useRouter();
  return (
    <View
      style={{
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        paddingHorizontal: sc(2),
        marginTop: vs(25),
        marginBottom: vs(2),
      }}
    >
      <View>
        <SubmitButton
          buttonText="Previous  ◀"
          isDisabled={!router.canGoBack()}
          onSubmit={() => router.back()}
        />
      </View>
      <View>
        <SubmitButton
          buttonText="Next  ▶"
          isDisabled={false}
          onSubmit={() => router.push(nextRoute)}
        />
      </View>
    </View>
  );
}
