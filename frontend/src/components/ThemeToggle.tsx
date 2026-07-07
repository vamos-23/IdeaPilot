import { Switch, useColorScheme as useDeviceColorScheme } from "react-native";
import useThemeStore from "@/src/store/useThemeStore";

export default function ThemeToggleSwitch() {
  const { theme, setTheme } = useThemeStore();
  const deviceTheme = useDeviceColorScheme();
  const isDark = theme === "system" ? deviceTheme === "dark" : theme === "dark";

  const handleThemeToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Switch
      trackColor={{ false: "#CBD5E1", true: "#4F46E5" }}
      thumbColor={!isDark ? "#f5dd4b" : "#ffffff"}
      onValueChange={handleThemeToggle}
      value={isDark}
      style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }}
    />
  );
}
