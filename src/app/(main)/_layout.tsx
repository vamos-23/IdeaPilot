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
        contentStyle: {
          backgroundColor: currentBgColor,
        },
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          animation: "slide_from_right",
        }}
      />

      <Stack.Screen
        name="aisuggestion"
        options={{
          presentation: "transparentModal",
          animation: "slide_from_bottom",
          contentStyle: {
            backgroundColor: "transparent",
          },
        }}
      />
    </Stack>
  );
}
