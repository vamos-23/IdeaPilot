import { useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import { Sun, Moon } from "lucide-react-native";
import { ms } from "@/constants/responsive";
import useThemeStore from "@/stores/useThemeStore";
import { useColorScheme } from "nativewind";

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useThemeStore();
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(theme);
  }, [setColorScheme, theme]);

  return (
    <View className="self-end absolute top-5 bottom-5 px-6 items-center">
      <TouchableOpacity
        className="rounded-full border-gray-300 p-2 bg-slate-200 
        dark:bg-slate-800"
        onPress={toggleTheme}
      >
        {theme === "light" ? (
          <Sun size={ms(25)} stroke="#f26005" strokeWidth={ms(2.5)} />
        ) : (
          <Moon size={ms(25)} stroke="#fff" strokeWidth={ms(2.5)}/>
        )}
      </TouchableOpacity>
    </View>
  );
}
