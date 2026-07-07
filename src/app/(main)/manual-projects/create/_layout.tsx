import { Stack } from "expo-router";

export default function ManualProjectsLayout() {
  return (
    <Stack
      screenOptions={{
        animation: "slide_from_right",
        animationDuration: 50,
        headerShown: false,
      }}
    >
      <Stack.Screen name="basic" />
      <Stack.Screen name="details" />
    </Stack>
  );
}
