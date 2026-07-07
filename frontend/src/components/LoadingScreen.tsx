import { View, Text, ActivityIndicator } from "react-native";
import useThemeStore from "../store/useThemeStore";
export default function LoadingScreen() {
  const { theme } = useThemeStore();
  return (
    <View className="bg-brandLight dark:bg-brandDark flex-1 justify-center items-center">
      <View className="flex-row gap-2 items-center justify-center">
        <ActivityIndicator
          size="large"
          color={theme === "light" ? "mediumblue" : "white"}
        />
        <Text className="text-[20px] italic text-textLight dark:text-white">
          Getting things ready...
        </Text>
      </View>
    </View>
  );
}
