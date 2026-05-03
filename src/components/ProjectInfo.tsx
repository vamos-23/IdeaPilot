import { StyleSheet, Text, View } from "react-native";
import { sc } from "../constants/responsive";
import useThemeStore from "@/src/store/useThemeStore";

type ProjectInfoProps = {
  title: string;
  icon: React.ReactNode;
  value: number;
  textColor: string;
};

export function ProjectInfo({
  title,
  icon,
  value,
  textColor,
}: ProjectInfoProps) {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";

  return (
    <View
      className="bg-white dark:bg-cardDark border shadow-sm shadow-black/5"
      style={[
        styles.projectContainer,
        {
          borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : `${textColor}30`,
        },
      ]}
    >
      <View className="flex-row items-center justify-between">
        <Text
          className="text-slate-900 dark:text-white font-nata-sans-bold"
          style={styles.heading}
        >
          {title}
        </Text>
        <View style={styles.iconContainer}>{icon}</View>
      </View>

      <Text style={[styles.stats, { color: textColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  projectContainer: {
    width: "100%",
    borderWidth: sc(1.5),
    borderRadius: sc(24),
    padding: sc(18),
  },
  heading: {
    fontSize: sc(16),
  },
  stats: {
    fontSize: sc(22),
    fontFamily: "Nata-Sans-Bold",
    marginTop: sc(4),
  },
  iconContainer: {
    opacity: 0.9,
  },
});
