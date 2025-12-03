import useThemeStore from "@/src/store/useThemeStore";
import { useColorScheme } from "nativewind";
import { Switch } from "react-native";

export default function ThemeToggleButton() {
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const handleThemeToggle = () => {
    toggleColorScheme();
    toggleTheme();
  };
  return (
    <Switch
    
      trackColor={{ false: "#767577", true: "#4169e1" }}
      thumbColor={colorScheme === "light" ? "#f5dd4b" : "#f4f3f4"}
      onValueChange={handleThemeToggle}
      value={colorScheme === "dark"}
      style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }} 
    />
  );
}
