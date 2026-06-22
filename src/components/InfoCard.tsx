import { View, StyleSheet, Text } from "react-native";
import { ms, sc } from "../constants/responsive";

type InfoCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export default function InfoCard({ icon, title, description }: InfoCardProps) {
  return (
    <View
      style={shapes.infoCardContainer}
      className="bg-slate-50 dark:bg-[#152240] border border-borderLight dark:border-borderDark justify-center items-center mb-4 mt-1.5 shadow-sm dark:shadow-none"
    >
      <View className="mb-2">{icon}</View>
      <Text
        style={shapes.title}
        className="text-textLight dark:text-white font-nata-sans-bold"
      >
        {title}
      </Text>
      <Text
        style={shapes.description}
        className="text-slate-500 dark:text-slate-400 font-nata-sans-medium mt-1"
      >
        {description}
      </Text>
    </View>
  );
}

const shapes = StyleSheet.create({
  infoCardContainer: {
    height: "16%",
    width: "98%",
    borderRadius: ms(16),
    padding: sc(10),
  },
  title: {
    fontSize: sc(16),
  },
  description: {
    fontSize: sc(13),
    textAlign: "center",
  },
});