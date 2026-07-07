import { StyleSheet, Text, View } from "react-native";
import useThemeStore from "../store/useThemeStore";
import { sc, vs } from "./../constants/responsive";
import ThemeToggleSwitch from "./ThemeToggle";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function ThemeSettings() {
  const appTheme = useThemeStore((s) => s.theme);
  return (
    <View
      className="border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark shadow-sm dark:shadow-none"
      style={styles.themeToggle}
    >
      <View>
        <View className="gap-2 flex-row items-center mb-1">
          <MaterialCommunityIcons
            name="theme-light-dark"
            color={appTheme === "light" ? "#0F172A" : "#F8FAFC"}
            size={sc(22)}
          />
          <Text
            className="text-textLight dark:text-white font-nata-sans-bold"
            style={styles.heading}
          >
            UI Theme
          </Text>
        </View>
        <View className="flex-row justify-between items-center mt-2">
          <Text
            className="text-slate-500 dark:text-slate-400 font-nata-sans-medium"
            style={{ fontSize: sc(13) }}
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
    borderRadius: sc(16),
    padding: sc(20),
    marginBottom: vs(24),
  },
  heading: { fontSize: sc(20) },
});
