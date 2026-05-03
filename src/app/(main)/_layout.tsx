import { Stack } from "expo-router";
import useThemeStore from "@/src/store/useThemeStore";

export default function RootLayout() {
  const { theme } = useThemeStore();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme === "dark" ? "#011035" : "#F1F7F9",
        },
      }}
    />
  );
}
