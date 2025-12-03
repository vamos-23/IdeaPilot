import { SunMoon } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import useThemeStore from "../store/useThemeStore";
import { sc, vs } from "./../constants/responsive";
import ThemeToggleSwitch from "./ThemeToggle";

export default function ThemeSettings() {
  const { theme } = useThemeStore();
  return (
    <View
      className="border-[#D8DCE3] dark:border-[#333537] bg-[#EEF1F6] dark:bg-[#121720]"
      style={styles.themeToggle}
    >
      <View>
        <View className="gap-2 flex-row items-center">
          <SunMoon
            stroke={theme === "light" ? "#000000" : "#ffffff"}
            size={sc(26)}
          />
          <Text
            className="text-black dark:text-white font-nata-sans-bold"
            style={styles.heading}
          >
            UI Theme
          </Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text
            className="text-textLight dark:text-textDark font-medium"
            style={{ fontSize: sc(11) }}
          >
            Choose your preferred theme
          </Text>
          <ThemeToggleSwitch />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  themeToggle: {
    flexGrow: 1,
    width: "100%",
    borderWidth: sc(1),
    borderRadius: sc(17),
    padding: sc(20),
    marginBottom: vs(28),
  },
  heading: {
    fontSize: sc(23),
  },
});
