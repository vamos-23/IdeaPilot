import useThemeStore from "@/src/store/useThemeStore";
import { Stack } from "expo-router";

const THEME_BACKGROUNDS = {
  dark: "#0B0F17",
  light: "#F1F5F9",
} as const;

export default function RootLayout() {
  const isDark = useThemeStore((s) => s.theme) === "dark";
  const currentBgColor = isDark
    ? THEME_BACKGROUNDS.dark
    : THEME_BACKGROUNDS.light;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_bottom",
        contentStyle: { backgroundColor: currentBgColor },
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="aisuggestion"
        options={{
          presentation: "modal",
          contentStyle: { backgroundColor: "transparent" },
          animation: "slide_from_bottom",
          animationDuration: 1100,
          animationTypeForReplace: "push",
        }}  
      />
    </Stack>
  );
}
