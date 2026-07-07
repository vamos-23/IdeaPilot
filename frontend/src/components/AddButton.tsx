import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Plus } from "lucide-react-native";
import { sc } from "../constants/responsive";
import useThemeStore from "../store/useThemeStore";
type AddButtonTypes = {
  onPress: () => void;
}
export default function AddButton({onPress} : AddButtonTypes) {
  const { theme } = useThemeStore();
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={shapes.addButton}
        className="justify-center items-center bg-[#59abe6] dark:bg-[#2c2c96d0] border-orange-400 dark:border-orange-700 elevation-lg dark:elevation-none"
      >
        <Plus size={sc(25)} stroke={theme === "light" ? "black" : "white"} />
      </View>
    </TouchableOpacity>
  );
}
const shapes = StyleSheet.create({
  addButton: {
    width: sc(39),
    height: sc(39),
    borderRadius: sc(10),
    borderWidth: sc(2),
  },
});
