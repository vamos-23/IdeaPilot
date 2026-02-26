import { StyleSheet, Text, View } from "react-native";
import { sc } from "../constants/responsive";

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
  return (
    <View
      className="border-[#02915a] dark:border-[#a1a9b3] bg-[#EEF1F6] dark:bg-[#121720]"
      style={styles.projectContainer}
    >
      <View className="flex-row items-center justify-between">
        <Text
          className="text-black dark:text-white font-nata-sans-bold"
          style={styles.heading}
        >
          {title}
        </Text>
        <View>{icon}</View>
      </View>
      <Text style={[styles.stats && { color: textColor }]}>{value}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  projectContainer: {
    flexGrow: 1,
    width: "100%",
    borderWidth: sc(1.5),
    borderRadius: sc(17),
    padding: sc(20),
  },
  heading: {
    fontSize: sc(17),
  },
  stats: {
    fontSize: sc(15),
    fontWeight: "bold"
  },
});
