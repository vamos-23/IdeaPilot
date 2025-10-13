import { Stack } from "expo-router";
export default function OnBoardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="techstack" />
      <Stack.Screen name="completionpage" />
    </Stack>
  );
}
