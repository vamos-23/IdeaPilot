import { TouchableOpacity, View } from "react-native";
import { Sun, Moon } from "lucide-react-native";
import { ms } from "@/constants/responsive";

export default function ThemeToggleButton() {
  return (
    <View className="self-end absolute top-5 bottom-5 rounded-lg px-6">
      <TouchableOpacity className="flex-row-reverse">
        <Sun size={ms(25)} />
        <Moon size={ms(25)} fill="black" />
      </TouchableOpacity>
    </View>
  );
}
