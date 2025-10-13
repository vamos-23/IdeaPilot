import { useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import { Sun, Moon } from "lucide-react-native";
import { ms } from "@/src/constants/responsive";
import useThemeStore from "@/src/store/useThemeStore";
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
        className="rounded-full border-gray-300 p-2 bg-slate-300 
        dark:bg-slate-800"
        onPress={toggleTheme}
      >
        {theme === "dark" ? (
          <Sun size={ms(25)} stroke="gold" strokeWidth={ms(2.5)} />
        ) : (
          <Moon size={ms(25)} stroke="#000000" strokeWidth={ms(2.5)} />
        )}
      </TouchableOpacity>
    </View>
  );
}
