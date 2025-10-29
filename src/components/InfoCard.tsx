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
      className="bg-[#e5e8ee] dark:bg-[#232348e4] justify-center items-center mb-5 mt-1.5 elevation-md dark:elevation-none"
    >
      <View className="mb-2">{icon}</View>
      <Text
        style={shapes.title}
        className="text-black dark:text-white font-semibold"
      >
        {title}
      </Text>
      <Text
        style={shapes.description}
        className="text-textLight dark:text-textDark"
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
    borderRadius: ms(12),
  },
  title: {
    fontSize: sc(16),
  },
  description: {},
});
