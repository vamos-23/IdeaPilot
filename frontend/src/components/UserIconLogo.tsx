import { View, StyleSheet } from "react-native";
import { ms, sc } from "../constants/responsive";
type RenderIconType = {
  icon: React.ReactNode;
};
export default function UserIconLogo({ icon }: RenderIconType) {
  return (
    <View
      style={shapes.userIconContainer}
      className="bg-[#3fb7d844] dark:bg-[#1b339a7a] justify-center items-center mb-5 mt-2 border-blue-500 dark:border-sky-700"
    >
      {icon}
    </View>
  );
}
const shapes = StyleSheet.create({
  userIconContainer: {
    height: sc(70),
    width: sc(70),
    borderRadius: ms(15),
    borderWidth: ms(2),
  },
});
